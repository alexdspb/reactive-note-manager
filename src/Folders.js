import React from 'react';
import './folders.css';
import MaterialIcon from 'material-icons-react';
import {editFolder, selectFolder, setSearch} from "./actions";
import {apiUrl, rootFolderId} from './constants'
import EditableLabel from 'react-editable-label'
import {Link} from 'react-router-dom'

const onFolderClick = (id) => {
    const { store } = window

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

const FolderItem = props => {
    const { store } = props
    const { app, folders } = store.getState()

    return folders.filter((item) => item.parentId === props.parentId).map((item, index) => {
        return (
            <li className={app.selectedFolderId === item.id ? 'folder-item selected' : 'folder-item'} key={index} data-id={item.id}>
                <Link to={`/folder/${item.id}`}><MaterialIcon icon={'folder'} onClick={() => onFolderClick(item.id)} data-tip={'Select a folder to view'} /></Link>
                <EditableLabel initialValue={item.name} save={value => saveEditableName(value, item, store)} />
                <div><span>{item.name}</span></div>
                <ul>
                    <FolderItem parentId={item.id} store={store} />
                </ul>
            </li>
        )
    })
}

const Folders = props => {
    const { store } = props

    return (
        <div id={'folders-list'}>
            <ul>
                <FolderItem parentId={rootFolderId} store={store} />
            </ul>
        </div>
    )
}

export default Folders;
