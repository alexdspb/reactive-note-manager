import React from 'react'
import './notes.css'
import { rootFolderId } from './constants'
import Note from "./Note"
import {editNote} from "./actions";


const searchNotes = (notes, params) => {
    let found = notes.sort((a, b) => {
        if (a.position < b.position) {
            return -1
        } else if (a.position > b.position) {
            return 1
        } else {
            return 0
        }
    })


    if (!params) {
        return found
    }

    // limit results to current folder
    if (params.folderId && params.folderId !== rootFolderId) {
        found = found.filter(item => (item.directoryId === params.folderId))
    }

    // search by query
    if (params.q) {
        if (params.advanced) {
            // perform advanced search
            found = found.filter(item => {
                return (
                    item.title.search(new RegExp(params.q, "i")) !== -1 ||
                    item.description.search(new RegExp(params.q, "i")) !== -1
                )
            })
        } else {
            // simple search
            found = found.filter(item => (
                item.title.search(new RegExp(params.q, "i")) !== -1)
            )
        }
    }

    return found
}

const NotesList = props => {
    const { store } = props
    const { app, notes } = store.getState()

    const foundNotes = searchNotes(notes, app.search)

    return (foundNotes.map((note, index) => {
        return (
            <Note store={store} note={note} key={index} index={index} isSelected={app.selectedNoteId === note.id}/>
        )
    }))
}

export default NotesList