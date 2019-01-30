import React from 'react'
import './notes.css'
import {
    AddNoteContainer,
    EditNoteContainer,
    NoteModalContainer,
    RemoveNoteContainer,
    RemoveNoteModalContainer,
    SearchFormContainer,
    NotesListContainer
} from './containers'

const Notes = props => {
    return (
        <div id={'notes-area'}>
            <div id={'notes-toolbar'}>
                <AddNoteContainer />
                <EditNoteContainer />
                <RemoveNoteContainer />
            </div>
            <div id={'notes-search'}>
                <SearchFormContainer />
            </div>
            <div id={'notes-list'}>
                <NotesListContainer />
            </div>
            <NoteModalContainer />
            <RemoveNoteModalContainer />
        </div>
    )
}

export default Notes

