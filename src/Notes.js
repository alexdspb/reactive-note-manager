import React from 'react'
import './notes.css'
import MaterialIcon from 'material-icons-react'
import { Modal, Button } from 'react-bootstrap'
import {addNote, editNote, removeNote, loadNote, selectNote, setNoteFolderId,
    setNoteTitle, setNoteDescription, setNoteTags, toggleNoteModal, setSearch} from './actions'
import {apiUrl, rootFolderId} from './constants'
import NotesList from './NotesList'
import Autocomplete from 'react-autocomplete'
import { Link } from 'react-router-dom'
import CreatableSelect from 'react-select/lib/Creatable'

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
        case 'tags':
            const tags = value.split(',').map((item) => item.trim())
            window.store.dispatch(setNoteTags(tags))
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

const getAllTags = (notes) => {
    let tags = [];
    notes.map((note) => {
        if (note.tags && note.tags.length > 0) {
            tags = tags.concat(note.tags)
        }
    })

    return [...new Set(tags)].map(item => ({label: item, value: item}))
}

const onTagsChange = (value, { action, removedValue }) => {
    return value.map(item => item.value)
}

const NoteModal = ({ store }) => {
    const { app, note, notes } = store.getState()
    const options = getAllTags(notes)
    const noteTags = note.tags ? note.tags.map(item => ({label: item, value: item})) : []

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
                    <textarea name={'description'} value={note.description} rows={5} onChange={onNodeModalChange} /><br />
                    <br />
                    <label>Tags</label><br />
                    <CreatableSelect
                        isClearable
                        isMulti
                        options={options}
                        defaultValue={noteTags}
                        onChange={(value, { action, removedValue }) => {
                            const tags = onTagsChange(value, { action, removedValue })
                            store.dispatch(setNoteTags(tags))
                        }}
                    />
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
        }} data-tip={'Create a new note'} >
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
        }} data-tip={'Edit selected note'} >
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
        }} data-tip={'Remove selected note'} >
            <div className={'toolbar-button-inner'}>
                <MaterialIcon icon={'remove'} size={14} />
                <span>Remove</span>
            </div>
        </button>
    )
}

const SearchForm = props => {
    const { store } = props
    const { app, notes } = store.getState()

    // fetch suggestions from notes content
    var suggestions = [];
    notes.map((note) => {
        note.title.split(' ').map((word) => {
            const cleanWord =  word.replace(/[\.,\?\!]+$/g, '').toLowerCase()
            if (cleanWord.length > 3) {
                suggestions = suggestions.concat([cleanWord])
            }
            return null
        })
        note.description.split(' ').map((word) => {
            const cleanWord =  word.replace(/[\.,\?\!]+$/g, '').toLowerCase()
            if (cleanWord.length > 3) {
                suggestions = suggestions.concat([cleanWord])
            }
            return null
        })
        if (note.tags && note.tags.length > 0) {
            suggestions = suggestions.concat(note.tags)
        }
        return null
    })

    return (
        <form>
            <div data-tip={'Type a text you wish to find.'}>
                <Autocomplete
                    value={app.search.q}
                    items={suggestions}
                    inputProps={{
                        placeholder: 'Search'
                    }}
                    wrapperStyle={{style: {width: '100%'}}}
                    getItemValue={item => item}
                    shouldItemRender={(item, value) => value.length >= 3 ? item.toLowerCase().indexOf(value.toLowerCase()) > -1 : false}
                    renderItem={(item, isHighlighted) =>
                        <div key={item} style={{ backgroundColor: isHighlighted ? '#eee' : 'transparent'}}>
                            <Link to={`/${app.search.advanced ? 'advanced_search' : 'search'}/${item}`}>{item}</Link>
                        </div>
                    }
                    onChange={(e, value) => {
                        store.dispatch(setSearch({q: value}))
                    }}
                    onSelect={value => {
                        store.dispatch(setSearch({q: value}))
                    }}
                />
            </div>
            <input type={'checkbox'} name={'advanced'} id={'advanced'} onChange={(e) => {
                store.dispatch(setSearch({advanced: e.target.checked}))
            }} checked={app.search.advanced}/>
            <label htmlFor={'advanced'} data-tip={'Advanced search includes body and tags.'}>use advanced search</label>
        </form>
    )
}

const Notes = props => {
    const { store, notes } = props

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
                <NotesList store={store} notes={notes} />
            </div>
            <NoteModal store={store} />
        </div>
    )
}

export default Notes

