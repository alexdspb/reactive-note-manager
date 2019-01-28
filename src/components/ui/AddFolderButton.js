import React from 'react'
import PropTypes from 'prop-types'
import MaterialIcon from 'material-icons-react'

const AddFolderButton = ({app = {}, folder = {}, onAdd=f=>f}) => {

    return (
        <button
            type={'button'} id={'add-button'} className={'toolbar-button'}
            onClick={(e) => {
                e.preventDefault()
                onAdd({parentId: app.selectedFolderId, name: ''})
            }}
            data-tip={'Create new folder'}
        >
            <div><MaterialIcon icon={'add'}/></div>
            <div>Add</div>
        </button>
    )
}

AddFolderButton.propTypes = {
    app: PropTypes.object,
    folder: PropTypes.object,
    onAdd: PropTypes.func
}

export default AddFolderButton