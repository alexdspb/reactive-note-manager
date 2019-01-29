import React from 'react'
import PropTypes from 'prop-types'
import MaterialIcon from 'material-icons-react'

const EditFolderButton = ({app = {}, folders = [], onEdit=f=>f}) => {
    return (
        <button
            id={'edit-button'} className={'toolbar-button'}
            onClick={(e) => {
                e.preventDefault()
                const [folderToEdit] = folders.filter(item => item.id === app.selectedFolderId)
                onEdit(folderToEdit)
            }}
            data-tip={'Edit selected folder'}
        >
            <div><MaterialIcon icon="edit"/></div>
            <div>Edit</div>
        </button>
    )
}

EditFolderButton.propTypes = {
    app: PropTypes.object,
    folders: PropTypes.array,
    onEdit: PropTypes.func
}

export default EditFolderButton