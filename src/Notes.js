import React from 'react'
import './notes.css'
import MaterialIcon from 'material-icons-react'
import { Modal, Button } from 'react-bootstrap'
import {addNote, editNote, removeNote, loadNote, selectNote, setNoteFolderId, setNoteTitle, setNoteDescription,
    toggleNoteModal, setSearch} from './actions'
import {apiUrl, rootFolderId} from './constants'
import NotesList from './NotesList'

const onNodeModalChange = (e) => {
    const {name, value} = e.target;
    switch (name) {
        case 'title':
            window.store.dispatch(setNoteTitle(value))
            break
        case 'parentId':
            window.store.dispatch(setNoteFolderId(value))
            break
        case 'description':
            window.store.dispatch(setNoteDescription(value))
            break
        default:
            console.log({[name]: value})
    }
}

const onNodeModalSubmit = (e) => {
    const { store } = window
    const { note } = store.getState()
    e.preventDefault()

    if (note.title) {
        const url = note.id ? `${apiUrl}/notices/${note.id}` : `${apiUrl}/notices`
        fetch(url, {
            method: note.id ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        }).then(
            result => result.json()
        ).then(
            result => {
                const action = note.id ? editNote(result) : addNote(result)
                store.dispatch(action)
            }
        )
        store.dispatch(toggleNoteModal())
        store.dispatch(loadNote({}))
    } else {
        alert('Title cannot be empty!')
    }
}

const NoteModal = ({ store }) => {
    const { app, note } = store.getState()

    return (
        <Modal show={app.showNoteModal}>
            <Modal.Header>
                <Button className={'close'} onClick={() => {
                    store.dispatch(toggleNoteModal())
                    store.dispatch(loadNote({}))
                }}>&times;</Button>
                <Modal.Title>{note.id ? 'Edit' : 'Add'} note</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form onSubmit={onNodeModalSubmit} autoComplete={'off'}>
                    <input type={'hidden'} />
                    <label>Title</label><br />
                    <input type={'text'} name={'title'} value={note.title} onChange={onNodeModalChange} /><br />
                    <br />
                    <label>Description</label><br />
                    <textarea name={'description'} onChange={onNodeModalChange} value={note.description} />
                    <br /><br />
                    <Button type={'submit'} bsStyle="primary">{note.id ? 'Save' : 'Add'}</Button>
                    <span style={{width: '20px', display: 'inline-block'}}></span>
                    <Button type={'reset'} bsStyle="default" onClick={() => {
                        store.dispatch(toggleNoteModal())
                        store.dispatch(loadNote({}))
                    }}>Cancel</Button>
                </form>
                <p>&nbsp;</p>
            </Modal.Body>

        </Modal>
    )
}

const AddNoteButton = ({store}) => {
    const { app } = store.getState()
    return (
        <button type={'button'} id={'add-note-button'} className={'toolbar-button'} onClick={() => {
            if (app.selectedFolderId > rootFolderId) {
                store.dispatch(setNoteFolderId(app.selectedFolderId))
                store.dispatch(toggleNoteModal())
            } else {
                alert('Select a folder for the new note')
            }
        }} >
            <div className={'toolbar-button-inner'}>
                <MaterialIcon icon={'add'} size={14} />
                <span>Add</span>
            </div>
        </button>
    )
}

const EditNoteButton = ({store}) => {
    const { app, notes } = store.getState()
    return (
        <button type={'button'} id={'edit-note-button'} className={'toolbar-button'} onClick={() => {
            if (app.selectedNoteId) {
                const [noteToEdit] = notes.filter(item => item.id === app.selectedNoteId)
                store.dispatch(loadNote(noteToEdit))
                store.dispatch(toggleNoteModal())
            } else {
                alert('Select a note to edit.');
            }
        }} >
            <div className={'toolbar-button-inner'}>
                <MaterialIcon icon={'edit'} size={14} />
                <span>Edit</span>
            </div>
        </button>
    )
}

const RemoveNoteButton = props => {
    const { store } = props
    const { app, notes } = store.getState()
    return (
        <button type={'button'} id={'remove-note-button'} className={'toolbar-button'} onClick={() => {
            if (app.selectedNoteId) {
                const [noteToRemove] = notes.filter(item => item.id === app.selectedNoteId)
                const confirmed = noteToRemove ? window.confirm(`Delete note "${noteToRemove.title}"`) : false
                if (confirmed) {
                    fetch(`${apiUrl}/notices/${noteToRemove.id}`, {
                        method: 'DELETE'
                    }).then(
                        result => {
                            if (result.status === 200) {
                                store.dispatch(removeNote(noteToRemove.id))
                                store.dispatch(selectNote(0))
                                store.dispatch(loadNote({}))
                            }
                        }
                    )
                }
            } else {
                alert('Select a note to remove.');
            }
        }} >
            <div className={'toolbar-button-inner'}>
                <MaterialIcon icon={'remove'} size={14} />
                <span>Remove</span>
            </div>
        </button>
    )
}

const onSearchFormChange = (e) => {
    const {name, value} = e.target

    switch (name) {
        case 'q':
            window.store.dispatch(setSearch({q: value}))
            break
        case 'advanced':
            window.store.dispatch(setSearch({advanced: e.target.checked}))
            break
        default:
            console.log({[name]: value})
    }
}

const SearchForm = props => {
    return (
        <form autoComplete={'off'} onChange={onSearchFormChange}>
            <input type={'text'} name={'q'} placeholder={'Search'} />
            <input type={'checkbox'} name={'advanced'} id={'advanced'} /><label htmlFor={'advanced'}>use advanced search</label>
        </form>
    )
}

const Notes = props => {
    const { store } = props

    return (
        <div id={'notes-area'}>
            <div id={'notes-toolbar'}>
                <AddNoteButton store={store} />
                <EditNoteButton store={store} />
                <RemoveNoteButton store={store} />
            </div>
            <div id={'notes-search'}>
                <SearchForm store={store} />
            </div>
            <div id={'notes-list'}>
                <NotesList store={store} />
            </div>
            <NoteModal store={store} />
        </div>
    )
}

export default Notes

