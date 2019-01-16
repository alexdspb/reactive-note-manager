import React, { Component } from 'react';
import './toolbar.css';
import MaterialIcon from 'material-icons-react';
import { addFolder, editFolder, removeFolder, selectFolder } from './actions'
import { apiUrl } from "./constants"

const addFolderDialog = async ({store}) => {
    const { app } = store.getState()
    let folderName = prompt('Create new folder:')
    if (folderName) {
        fetch(`${apiUrl}/directories`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                parentId: app.selectedFolderId,
                name: folderName
            })
        }).then(
            result => result.json()
        ).then(
            result => {
                store.dispatch(addFolder(result))
            }
        )
    }
    return null;
}

const editFolderDialog = async ({store}) => {
    const { app, folders } = store.getState()
    const folderId = app.selectedFolderId > 1 ? app.selectedFolderId : 0
    const [folderToEdit] = folderId ? folders.filter(item => item.id === folderId) : []
    const folderName = folderId ? prompt(`Rename folder "${folderToEdit.name}" to:`, folderToEdit.name) : ''
    if (folderName && folderName !== folderToEdit.name) {
        fetch(`${apiUrl}/directories/${folderId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: folderToEdit.id,
                parentId: folderToEdit.parentId,
                name: folderName
            })
        }).then(
            result => {
                console.log(result)
                if (result.status === 200) {
                    store.dispatch(editFolder({...folderToEdit, name: folderName}))
                }
            }
        )
    }
    return null;
}

const removeFolderDialog = async ({store}) => {
    const { app, folders } = store.getState()
    const folderId = app.selectedFolderId > 1 ? app.selectedFolderId : 0
    const [folderToRemove] = folderId ? folders.filter(item => item.id === folderId) : []
    const confirmed = folderId && window.confirm('Remove selected folder: ' + folderToRemove.name)
    if (confirmed) {
        fetch(`${apiUrl}/directories/${folderId}`, {
            method: 'DELETE'
        }).then(
            result => {
                if (result.status === 200) {
                    store.dispatch(removeFolder(folderId))
                    store.dispatch(selectFolder(1))
                }
            }
        )
    }
    return null;
}

const AddFolderButton = ({store}) => {
    return (
        <button type={'button'} id={'add-button'} className={'toolbar-button'} onClick={() => addFolderDialog({store})} >
            <div><MaterialIcon icon={'add'}/></div>
            <div>Add</div>
        </button>
    )
}

const EditFolderButton = ({store}) => {
    return (
        <button id={'edit-button'} className={'toolbar-button'} onClick={() => editFolderDialog({store})} >
            <div><MaterialIcon icon="edit"/></div>
            <div>Edit</div>
        </button>
    )
}

const RemoveFolderButton = ({store}) => {
    return (
        <button id={'remove-button'} className={'toolbar-button'} onClick={() => removeFolderDialog({store})}>
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
            </div>
        );
    }
}

export default Toolbar;
