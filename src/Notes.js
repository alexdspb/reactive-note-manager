import React from 'react'
import './notes.css'
import { Modal, Button } from 'react-bootstrap'
import NotesList from './NotesList'
import { Link } from 'react-router-dom'
import { AddNoteContainer, EditNoteContainer, NoteModalContainer, RemoveNoteContainer, RemoveNoteModalContainer } from './containers'
import SearchForm from './components/ui/SearchForm'

const Notes = props => {
    const { store, notes } = props

    return (
        <div id={'notes-area'}>
            <div id={'notes-toolbar'}>
                <AddNoteContainer />
                <EditNoteContainer />
                <RemoveNoteContainer />
            </div>
            <div id={'notes-search'}>
                <SearchForm store={store} />
            </div>
            <div id={'notes-list'}>
                <NotesList store={store} notes={notes} />
            </div>
            <NoteModalContainer />
            <RemoveNoteModalContainer />
        </div>
    )
}

export default Notes

