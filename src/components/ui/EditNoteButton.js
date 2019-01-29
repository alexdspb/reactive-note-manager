import React from 'react'
import PropTypes from 'prop-types'
import MaterialIcon from 'material-icons-react'

const EditNoteButton = ({app = {}, notes = [], onEdit=f=>f}) => {
    return (
        <button type={'button'} id={'edit-note-button'} className={'toolbar-button'} onClick={() => {
            if (!app.selectedNoteId) {
                return
            }
            const [noteToEdit] = notes.filter(item => item.id === app.selectedNoteId)
            onEdit(noteToEdit)
        }} data-tip={'Edit selected note'} >
            <div className={'toolbar-button-inner'}>
                <MaterialIcon icon={'edit'} size={14} />
                <span>Edit</span>
            </div>
        </button>
    )
}

EditNoteButton.propTypes = {
    app: PropTypes.object,
    notes: PropTypes.array,
    onEdit: PropTypes.func
}

export default EditNoteButton