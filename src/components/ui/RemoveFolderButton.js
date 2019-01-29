import React from 'react'
import PropTypes from 'prop-types'
import MaterialIcon from 'material-icons-react'
import {rootFolderId} from "../../constants";

const RemoveFolderButton = ({app = {}, folders = [], onRemove=f=>f}) => {
    return (
        <button
            id={'remove-button'} className={'toolbar-button'}
            onClick={(e) => {
                if (!app.selectedFolderId || app.selectedFolderId === rootFolderId) {
                    return
                }
                const [folderToRemove] = folders.filter(item => item.id === app.selectedFolderId)
                onRemove(folderToRemove)
            }}
            data-tip={'Remove selected folder'}
        >
            <div><MaterialIcon icon="remove"/></div>
            <div>Remove</div>
        </button>
    )
}

RemoveFolderButton.propTypes = {
    app: PropTypes.object,
    folders: PropTypes.array,
    onRemove: PropTypes.func
}

export default RemoveFolderButton