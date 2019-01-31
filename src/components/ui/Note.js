import React, {Component} from 'react'
import '../../notes.css'
import MaterialIcon from 'material-icons-react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export const dndNoteSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index
        }
    }
}

export const dndNoteTarget = {
    hover(props, monitor, component) {
        if (!component) {
            return null
        }
        const dragIndex = monitor.getItem().index
        const hoverIndex = props.index

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return
        }

        // Time to actually perform the action
        props.moveNote(dragIndex, hoverIndex)

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex
    }
}
class Note extends Component {
    render() {
        const { app, note, notes, isSelected, connectDragSource, connectDropTarget,
            onClick=f=>f, onDoubleClick=f=>f, onDragStart=f=>f, onDragEnd=f=>f } = this.props
        const noteClass = `note-item ${isSelected ? 'selected' : ''} ${note.id === app.dragNoteId ? 'dragging' : ''}`

        return connectDragSource(
            connectDropTarget(
                <div
                    id={`note-${note.id}`}
                    className={noteClass}
                    onClick={(e) => onClick(note)}
                    onDoubleClick={(e) => onDoubleClick(note)}
                    onDragStart={(e) => onDragStart(note.id)}
                    onDragEnd={(e) => onDragEnd(notes)}
                    data-id={note.id}
                    title={'Click selects note; Double click edits note; Drag changes note position.'}
                >
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
    app: PropTypes.object,
    notes: PropTypes.array
}

export default Note

