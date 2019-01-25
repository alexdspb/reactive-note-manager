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
                    <input type={'hidden'} />
                    <label>Name</label><br />
                    <input type={'text'} name={'name'} value={folder ? folder.name : ''} onChange={onFolderModalChange} /><br />
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


const AddFolderButton = ({store}) => {
    const { app } = store.getState()

    return (
        <button
            type={'button'} id={'add-button'} className={'toolbar-button'}
            onClick={() => {
                store.dispatch(loadFolder({parentId: app.selectedFolderId}));
                store.dispatch(toggleFolderModal())
            }}
            data-tip={'Create new folder'}
        >
            <div><MaterialIcon icon={'add'}/></div>
            <div>Add</div>
        </button>
    )
}

const EditFolderButton = ({store}) => {
    const { app, folders } = store.getState()

    return (
        <button
            id={'edit-button'} className={'toolbar-button'}
            onClick={() => {
                if (app.selectedFolderId && app.selectedFolderId !== rootFolderId) {
                    const [folderToEdit] = folders.filter(item => item.id === app.selectedFolderId)
                    store.dispatch(loadFolder(folderToEdit))
                    store.dispatch(toggleFolderModal())
                } else {
                    alert('Select a note to edit.');
                }
            }}
            data-tip={'Edit selected folder'}
        >
            <div><MaterialIcon icon="edit"/></div>
            <div>Edit</div>
        </button>
    )
}

const RemoveFolderButton = ({store}) => {
    const { app, folders } = store.getState()

    return (
        <button
            id={'remove-button'} className={'toolbar-button'}
            onClick={() => {
                if (app.selectedFolderId && app.selectedFolderId !== rootFolderId) {
                    const [folderToRemove] = folders.filter(item => item.id === app.selectedFolderId)
                    store.dispatch(loadFolder(folderToRemove))
                    store.dispatch(toggleRemoveFolderModal())
                } else {
                    alert('Select a note to edit.');
                }
            }}
            data-tip={'Remove selected folder'}
        >
            <div><MaterialIcon icon="remove"/></div>
            <div>Remove</div>
        </button>
    )
}


class Toolbar extends Component {

    render() {
        const {store} = this.props

        return (
            <div id={'toolbar'}>
                <AddFolderButton store={store} />
                <EditFolderButton store={store} />
                <RemoveFolderButton store={store}/>
                <FolderModal store={store}/>
                <RemoveFolderModal store={store}/>
            </div>
        );
    }
}

export default Toolbar;
