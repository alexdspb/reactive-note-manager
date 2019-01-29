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
import { AddFolderContainer, EditFolderContainer, RemoveFolderContainer, FolderModalContainer } from './containers'


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
                <FolderModalContainer />
                <RemoveFolderModal store={store}/>
            </div>
        );
    }
}

export default Toolbar;
