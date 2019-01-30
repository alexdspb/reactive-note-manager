import React, {Component} from 'react'
import '../../notes.css'
import MaterialIcon from 'material-icons-react'
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types'


class Note extends Component {
    render() {
        const { note, isSelected, isDragging, connectDragSource, connectDropTarget, onClick=f=>f, onDoubleClick=f=>f } = this.props
        const noteClass = `note-item ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`


        return connectDragSource(
            connectDropTarget(
                <div id={`note-${note.id}`} className={noteClass} onClick={(e) => onClick(note)} data-id={note.id}>
                    <ReactTooltip/>
                    <div className={'note-icon'} data-id={note.id}
                         data-tip={'Select a note you want to edit or remove.'}
                         onDoubleClick={(e) => onDoubleClick(note)}
                    >
                        <MaterialIcon icon={'note'} data-id={note.id}/>
                    </div>
                    <div className={'note-title'} data-id={note.id} data-tip={note.title}>
                        {note.title}
                    </div>
                </div>
            )
        )
    }
}

Note.propTypes = {
    note: PropTypes.object
}

export default Note

