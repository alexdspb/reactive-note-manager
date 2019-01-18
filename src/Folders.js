import React from 'react';
import './folders.css';
import MaterialIcon from 'material-icons-react';
import {editFolder, editNote, selectFolder, setSearch} from "./actions";
import {apiUrl, rootFolderId} from './constants'
import EditableLabel from 'react-editable-label'
import {Link} from 'react-router-dom'

const onFolderClick = (id) => {
    const { store } = window
    const { app } = store.getState()

    store.dispatch(selectFolder(id))
    store.dispatch(setSearch({folderId: id, q: ''}))
}

const saveEditableName = (value, folder, store) => {
    const newFolder = {...folder, name: value}
    const url = `${apiUrl}/directories/${folder.id}`

    fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFolder)
    }).then(
        result => result.json()
    ).then(
        result => {
            store.dispatch(editFolder(result))
        }
    )
}

const FolderItem = props => props.foldersData.filter(item => item.parentId === props.parentId).map((item, index) => {
    const { foldersData, store } = props
    const { app, folders } = store.getState()

    return (
            <li className={app.selectedFolderId === item.id ? 'folder-item selected' : 'folder-item'} key={index} data-id={item.id}>
                <Link to={`/folder/${item.id}`}><MaterialIcon icon={'folder'} onClick={() => onFolderClick(item.id)} data-tip={'Select a folder to view'} /></Link>
                <EditableLabel initialValue={item.name} save={value => saveEditableName(value, item, store)} />
                <ul>
                    <FolderItem foldersData={folders} parentId={item.id} store={store} />
                </ul>
            </li>
    )
});

const Folders = props => {
    const { store, foldersData } = props
    const {folders} = store.getState()

    return (
        <div id={'folders-list'}>
            <ul>
                <FolderItem foldersData={folders} parentId={rootFolderId} store={store} />
            </ul>
        </div>
    )
}

export default Folders;
