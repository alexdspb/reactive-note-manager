import React, {Component} from 'react'
import './notes.css'
import MaterialIcon from 'material-icons-react'
import {selectNote, editNote} from './actions'
import {apiUrl, dndTypes} from './constants'
import { findDOMNode } from 'react-dom'
import {DragSource, DropTarget} from 'react-dnd'
import ReactTooltip from 'react-tooltip'


const noteSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
            note: props.note
        }
    }
}

const noteTarget = {
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

        console.log(dragIndex, hoverIndex)
        const dragNote = {...monitor.getItem().note, position: hoverIndex}
        console.log('dragNote', dragNote)
        window.store.dispatch(editNote(dragNote))

        monitor.getItem().index = hoverIndex
    },
    drop(props, monitor, component) {
        const item = monitor.getItem()
        const dragIndex = item.index
        const hoverIndex = props.index

        const newNote = {...item.note, position: hoverIndex}
        console.log('newNote', newNote)
        const url = `${apiUrl}/notices/${item.note.id}`
        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNote)
        }).then(
            result => result.json()
        ).then(
            result => {
                window.store.dispatch(editNote(result))
            }
        )

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex
    }
}


class Note extends Component {
    render() {
        const { store, note, index, isSelected, isDragging, connectDragSource, connectDropTarget } = this.props
        const { app } = store.getState()
        const noteClass = `note-item ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`


        return connectDragSource(
            connectDropTarget(
                <div id={`note-${note.id}`} className={noteClass} onClick={() => {
                    store.dispatch(selectNote(note.id))
                }} data-id={note.id}>
                    <ReactTooltip/>
                    <div className={'note-icon'} data-id={note.id} data-tip={'Select a note you want to edit or remove.'}>
                        <MaterialIcon icon={'note'} data-id={note.id}/>
                    </div>
                    <div className={'note-title'} data-id={note.id} data-tip={note.title}>{note.title}</div>
                </div>
            )
        )
    }
}

export default DropTarget(
    dndTypes.NOTE,
    noteTarget,
    connect => ({
        connectDropTarget: connect.dropTarget()
    })
)(
    DragSource(
        dndTypes.NOTE,
        noteSource,
        (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging()
        })
    )(Note)
)

