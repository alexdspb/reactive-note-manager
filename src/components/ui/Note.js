import React, {Component} from 'react'
import '../../notes.css'
import MaterialIcon from 'material-icons-react'
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'


class Note extends Component {
    render() {
        const { note, isSelected, isDragging, connectDragSource, connectDropTarget, onClick=f=>f, onDoubleClick=f=>f } = this.props
        const noteClass = `note-item ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`


        return connectDragSource(
            connectDropTarget(
                <div
                    id={`note-${note.id}`}
                    className={noteClass}
                    onClick={(e) => onClick(note)}
                    onDoubleClick={(e) => onDoubleClick(note)}
                    data-id={note.id}
                    data-tip={'Click selects note; Double click edits note.'}
                >
                    <ReactTooltip/>
                    <Link to={`/note/${note.id}`}>
                        <div className={'note-icon'} data-id={note.id} data-tip={''}>
                            <MaterialIcon icon={'note'} data-id={note.id}/>
                        </div>
                        <div className={'note-title'} data-id={note.id} title={note.title} data-tip={''}>
                            {note.title}
                        </div>
                    </Link>
                </div>
            )
        )
    }
}

Note.propTypes = {
    note: PropTypes.object
}

export default Note

