import React from 'react';
import './folders.css';
import MaterialIcon from 'material-icons-react';
import { selectFolder, setSearch } from "./actions";
import { rootFolderId } from './constants'

const onFolderClick = (id) => {
    const { store } = window
    store.dispatch(selectFolder(id))
    store.dispatch(setSearch({folderId: id}))
}

const FolderItem = props => props.foldersData.filter(item => item.parentId === props.parentId).map((item, index) => {
    const { foldersData, store } = props
    const { app } = store.getState()

    return (
            <li className={app.selectedFolderId === item.id ? 'folder-item selected' : 'folder-item'} key={index} data-id={item.id}>
                <MaterialIcon icon={'folder'} onClick={() => onFolderClick(item.id)} />
                <span onClick={() => onFolderClick(item.id)}>{item.name}</span>
                <ul>
                    <FolderItem foldersData={foldersData} parentId={item.id} store={store} />
                </ul>
            </li>
    )
});

const Folders = props => {
    const { store, foldersData } = props

    return (
        <div id={'folders-list'} data-tip={'Select a folder to view'}>
            <ul>
                <FolderItem foldersData={foldersData} parentId={rootFolderId} store={store} />
            </ul>
        </div>
    )
}

export default Folders;
