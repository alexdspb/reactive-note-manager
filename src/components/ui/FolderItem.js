import React from 'react'
import PropTypes from 'prop-types'
import {rootFolderId} from "../../constants";
import { Link } from 'react-router-dom'
import MaterialIcon from 'material-icons-react'
import EditableLabel from 'react-editable-label'
import { FolderItemContainer } from '../../containers'

const FolderItem = ({parentId = rootFolderId, app = {}, folders = [], onClick=f=>f, onSaveName=f=>f}) => {
    return folders.filter((item) => item.parentId === parentId).map((item, index) => {
        return (
            <li className={app.selectedFolderId === item.id ? 'folder-item selected' : 'folder-item'} key={index} data-id={item.id}>
                <Link to={`/folder/${item.id}`}><MaterialIcon icon={'folder'} onClick={(e) => onClick(item.id)} data-tip={'Select a folder to view'} /></Link>
                <EditableLabel initialValue={item.name} save={value => onSaveName(value, item)} />
                <ul>
                    <FolderItemContainer parentId={item.id} />
                </ul>
            </li>
        )
    })
}

FolderItem.propTypes = {
    parentId: PropTypes.number,
    app: PropTypes.object,
    folders: PropTypes.array,
    onClick: PropTypes.func,
    onSaveName: PropTypes.func
}

export default FolderItem