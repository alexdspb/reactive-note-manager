import React, { Component } from 'react';
import './toolbar.css';
import MaterialIcon from 'material-icons-react';
import {
    addFolder,
    editFolder,
    removeFolder,
    selectFolder,
    setFolderName,
    toggleFolderModal,
    toggleRemoveFolderModal,
    loadFolder
} from './actions'
import {apiUrl, rootFolderId} from "./constants"
import { Modal, Button } from 'react-bootstrap'
import { AddFolderContainer, EditFolderContainer, RemoveFolderContainer } from './containers'


const onFolderModalChange = (e) => {
    const {name, value} = e.target;
    switch (name) {
        case 'name':
            window.store.dispatch(setFolderName(value))
            break
        default:
            console.log({[name]: value})
    }
}

const onFolderModalSubmit = (e) => {
    const { store } = window
    const { folder } = store.getState()
    e.preventDefault()

    if (!folder.name || folder.name === '') {
        alert('Title cannot be empty!')
        return
    }

    const url = folder.id ? `${apiUrl}/directories/${folder.id}` : `${apiUrl}/directories`
    fetch(url, {
        method: folder.id ? 'PUT' : 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(folder)
    }).then(
        result => result.json()
    ).then(
        result => {
            const action = folder.id ? editFolder(result) : addFolder(result)
            store.dispatch(action)
        }
    )
    store.dispatch(toggleFolderModal())
    store.dispatch(loadFolder({}))
}

const FolderModal = ({ store }) => {
    const { app, folder } = store.getState()

    return (
        <Modal show={app.showFolderModal}>
            <Modal.Header>
                <Button className={'close'} onClick={() => {
                    store.dispatch(toggleFolderModal())
                    store.dispatch(loadFolder({}))
                }}>&times;</Button>
                <Modal.Title>{folder && folder.id ? 'Edit' : 'Add'} folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={onFolderModalSubmit} autoComplete={'off'}>
                    <label>Name</label><br />
                    <input type={'text'} name={'name'} value={folder.name} onChange={onFolderModalChange} autoFocus={true} /><br />
                    <br />
                    <Button type={'submit'} bsStyle="primary">{folder && folder.id ? 'Save' : 'Add'}</Button>
                    <span style={{width: '20px', display: 'inline-block'}}></span>
                    <Button type={'reset'} bsStyle="default" onClick={() => {
                        store.dispatch(toggleFolderModal())
                        store.dispatch(loadFolder({}))
                    }}>Cancel</Button>
                </form>
                <p>&nbsp;</p>
            </Modal.Body>
        </Modal>
    )
}

const onRemoveFolderModalSubmit = (e) => {
    const { store } = window
    const { folder } = store.getState()
    e.preventDefault()

    if (!folder.id) {
        alert('Folder not selected!')
        return
    }

    fetch(
        `${apiUrl}/directories/${folder.id}`,
        {
            method: 'DELETE',
            body: JSON.stringify(folder)
        }
    ).then(
        result => {
            if (result.ok === true) {
                store.dispatch(removeFolder(folder.id))
                store.dispatch(selectFolder(rootFolderId))
            }
        }
    )
    store.dispatch(toggleRemoveFolderModal())
    store.dispatch(loadFolder({}))
}

const RemoveFolderModal = ({ store }) => {
    const { app, folder } = store.getState()

    return (
        <Modal show={app.showRemoveFolderModal}>
            <Modal.Header>
                <Button className={'close'} onClick={() => {
                    store.dispatch(toggleRemoveFolderModal())
                    store.dispatch(loadFolder({}))
                }}>&times;</Button>
                <Modal.Title>Remove folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={onRemoveFolderModalSubmit} autoComplete={'off'}>
                    <p><label>Remove folder "{folder.name}"?</label></p>
                    <Button type={'submit'} bsStyle="primary">Remove</Button>
                    <span style={{width: '20px', display: 'inline-block'}}></span>
                    <Button type={'reset'} bsStyle="default" onClick={() => {
                        store.dispatch(toggleRemoveFolderModal())
                        store.dispatch(loadFolder({}))
                    }}>Cancel</Button>
                </form>
                <p>&nbsp;</p>
            </Modal.Body>
        </Modal>
    )
}


class Toolbar extends Component {

    render() {
        const {store} = this.props

        return (
            <div id={'toolbar'}>
                <AddFolderContainer />
                <EditFolderContainer />
                <RemoveFolderContainer />
                <FolderModal store={store}/>
                <RemoveFolderModal store={store}/>
            </div>
        );
    }
}

export default Toolbar;
