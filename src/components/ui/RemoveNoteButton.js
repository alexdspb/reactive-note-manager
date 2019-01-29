import React from 'react'
import PropTypes from 'prop-types'
import MaterialIcon from 'material-icons-react'

const RemoveNoteButton = ({app = {}, notes = [], onRemove=f=>f}) => {
    return (
        <button type={'button'} id={'remove-note-button'} className={'toolbar-button'} onClick={() => {
            if (!app.selectedNoteId) {
                return
            }
            const [noteToRemove] = notes.filter(item => item.id === app.selectedNoteId)
            onRemove(noteToRemove)
        }} data-tip={'Remove selected note'} >
            <div className={'toolbar-button-inner'}>
                <MaterialIcon icon={'remove'} size={14} />
                <span>Remove</span>
            </div>
        </button>
    )
}

RemoveNoteButton.propTypes = {
    app: PropTypes.object,
    notes: PropTypes.array,
    onRemove: PropTypes.func
}

export default RemoveNoteButton