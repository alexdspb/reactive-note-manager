import React from 'react'
import PropTypes from 'prop-types'
import MaterialIcon from 'material-icons-react'

const AddNoteButton = ({app = {}, note = {}, onAdd=f=>f}) => {
    return (
        <button type={'button'} id={'add-note-button'} className={'toolbar-button'} onClick={() => onAdd({directoryId: app.selectedFolderId})} data-tip={'Create a new note'} >
            <div className={'toolbar-button-inner'}>
                <MaterialIcon icon={'add'} size={14} />
                <span>Add</span>
            </div>
        </button>
    )
}

AddNoteButton.propTypes = {
    app: PropTypes.object,
    note: PropTypes.object,
    onAdd: PropTypes.func
}

export default AddNoteButton