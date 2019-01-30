import React from 'react'
import '../../notes.css'
import { rootFolderId } from '../../constants'
import PropTypes from 'prop-types'
import {NoteContainer} from '../../containers'

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
            // perform advanced search - by title, description and tags
            found = found.filter(item => {
                return (
                    (item.title.search(new RegExp(params.q, "i")) !== -1) ||
                    (item.description.search(new RegExp(params.q, "i")) !== -1) ||
                    (item.tags ? item.tags.join(',').search(new RegExp(params.q, "i")) !== -1 : false)
                )
            })
        } else {
            // simple search - by title
            found = found.filter(item => (
                item.title.search(new RegExp(params.q, "i")) !== -1)
            )
        }
    }

    return found
}

const NotesList = ({app = {}, notes = []}) => {
    const foundNotes = searchNotes(notes, app.search)

    return (foundNotes.map((note, index) => {
        return (
            <NoteContainer note={note} key={index} index={index} isSelected={app.selectedNoteId === note.id}/>
        )
    }))
}

NotesList.propTypes = {
    app: PropTypes.object,
    notes: PropTypes.array
}

export default NotesList