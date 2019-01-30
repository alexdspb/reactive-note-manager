import { connect } from 'react-redux'

import Home from './components/ui/Home'

import AddFolderButton from './components/ui/AddFolderButton'
import EditFolderButton from './components/ui/EditFolderButton'
import RemoveFolderButton from './components/ui/RemoveFolderButton'
import FolderModal from './components/ui/FolderModal'
import RemoveFolderModal from './components/ui/RemoveFolderModal'
import FolderItem from './components/ui/FolderItem'

import AddNoteButton from './components/ui/AddNoteButton'
import EditNoteButton from './components/ui/EditNoteButton'
import RemoveNoteButton from './components/ui/RemoveNoteButton'
import NoteModal from './components/ui/NoteModal'
import RemoveNoteModal from './components/ui/RemoveNoteModal'
import SearchForm from './components/ui/SearchForm'

import {
    addFolder,
    addNote,
    editFolder,
    editNote, fetchFolders, fetchNotes,
    loadFolder,
    loadNote,
    removeFolder,
    removeNote,
    selectFolder,
    selectNote,
    setFolderName,
    setNoteDescription,
    setNoteFolderId,
    setNoteTags,
    setNoteTitle,
    setSearch,
    toggleFolderModal,
    toggleNoteModal,
    toggleRemoveFolderModal,
    toggleRemoveNoteModal
} from './actions'
import {apiUrl, rootFolderId} from './constants'
import {folderExist, getNoteById, noteExist} from "./utils";

export const HomeContainer = connect(
    state => ({
        app: state.app,
        folders: state.folders,
        notes: state.notes
    }),
    dispatch => ({
        onDidMount(match, folders, notes) {
            fetch(`${apiUrl}/directories`)
                .then(result => result.json())
                .then(result => dispatch(fetchFolders(result)))
                .then(result => {
                    // select folder that passed through url
                    const folderId = (match.path === '/folder/:id' && match.isExact && folderExist(parseInt(match.params.id, 10), folders)) ? parseInt(match.params.id, 10) : rootFolderId
                    console.log(folders)
                    dispatch(selectFolder(folderId))
                    dispatch(setSearch({folderId: folderId, q: ''}))
                })
            fetch(`${apiUrl}/notices`)
                .then(result => result.json())
                .then(result => {
                    dispatch(fetchNotes(result))
                })
                .then(result => {
                    // select and edit the note that passed through url
                    if (match.path === '/note/:id' && match.isExact && noteExist(parseInt(match.params.id, 10), notes)) {
                        const noteId = parseInt(match.params.id, 10)
                        dispatch(selectNote(noteId))
                        // show edit modal dialog
                        const note = getNoteById(noteId, notes)
                        dispatch(loadNote(note))
                        dispatch(toggleNoteModal())
                    }
                    // search notes by the query that passed through url
                    if (match.path === '/search/:q' && match.isExact) {
                        dispatch(setSearch({q: match.params.q}))
                    } else if (match.path === '/advanced_search/:q' && match.isExact) {
                        dispatch(setSearch({q: match.params.q, advanced: true}))
                    }
                })
        }
    })
)(Home)

export const AddFolderContainer = connect(
    state => ({
        app: state.app,
        folder: state.folder
    }),
    dispatch => ({
        onAdd(folder) {
            dispatch(loadFolder(folder))
            dispatch(toggleFolderModal())
        }
    })
)(AddFolderButton)

export const EditFolderContainer = connect(
    state => ({
        app: state.app,
        folders: state.folders
    }),
    dispatch => ({
        onEdit(folder) {
            dispatch(loadFolder(folder))
            dispatch(toggleFolderModal())
        }
    })
)(EditFolderButton)

export const RemoveFolderContainer = connect(
    state => ({
        app: state.app,
        folders: state.folders
    }),
    dispatch => ({
        onRemove(folder) {
            dispatch(loadFolder(folder))
            dispatch(toggleRemoveFolderModal())
        }
    })
)(RemoveFolderButton)

export const FolderModalContainer = connect(
    state => ({
        app: state.app,
        folder: state.folder
    }),
    dispatch => ({
        onChange(e) {
            const {name, value} = e.target;
            switch (name) {
                case 'name':
                    dispatch(setFolderName(value))
                    break
                default:
                    console.log({[name]: value})
            }
        },
        onSubmit(folder) {

            if (!folder.name || folder.name === '') {
                return
            }

            const url = folder.id ? `${apiUrl}/directories/${folder.id}` : `${apiUrl}/directories`
            fetch(url, {
                method: folder.id ? 'PUT' : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(folder)
            }).then(
                result => result.json()
            ).then(
                result => {
                    const action = folder.id ? editFolder(result) : addFolder(result)
                    dispatch(action)
                }
            )
            dispatch(loadFolder({}))
            dispatch(toggleFolderModal())
        },
        onCancel(e) {
            dispatch(loadFolder({}))
            dispatch(toggleFolderModal())
        }
    })
)(FolderModal)

export const RemoveFolderModalContainer = connect(
    state => ({
        app: state.app,
        folder: state.folder
    }),
    dispatch => ({
        onSubmit(folder) {

            if (!folder.id) {
                return
            }

            fetch(
                `${apiUrl}/directories/${folder.id}`,
                {
                    method: 'DELETE',
                    body: JSON.stringify(folder)
                }
            ).then(
                result => {
                    if (result.ok === true) {
                        dispatch(removeFolder(folder.id))
                        dispatch(selectFolder(rootFolderId))
                    }
                }
            )
            dispatch(loadFolder({}))
            dispatch(toggleRemoveFolderModal())
        },
        onCancel(e) {
            dispatch(loadFolder({}))
            dispatch(toggleRemoveFolderModal())
        }
    })
)(RemoveFolderModal)

export const FolderItemContainer = connect(
    state => ({
        app: state.app,
        folders: state.folders
    }),
    dispatch => ({
        onClick(id) {
            dispatch(selectFolder(id))
            dispatch(setSearch({folderId: id, q: ''}))
        },
        onSaveName(name, folder) {
            const newFolder = {...folder, name: name}
            const url = `${apiUrl}/directories/${folder.id}`

            fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFolder)
            }).then(
                result => result.json()
            ).then(
                result => {
                    dispatch(editFolder(result))
                }
            )
        }
    })
)(FolderItem)


export const AddNoteContainer = connect(
    state => ({
        app: state.app,
        note: state.note
    }),
    dispatch => ({
        onAdd(note) {
            dispatch(loadNote(note))
            dispatch(toggleNoteModal())
        }
    })
)(AddNoteButton)

export const EditNoteContainer = connect(
    state => ({
        app: state.app,
        notes: state.notes
    }),
    dispatch => ({
        onEdit(note) {
            dispatch(loadNote(note))
            dispatch(toggleNoteModal())
        }
    })
)(EditNoteButton)

export const NoteModalContainer = connect(
    state => ({
        app: state.app,
        note: state.note,
        notes: state.notes
    }),
    dispatch => ({
        onChange(e) {
            const {name, value} = e.target;
            switch (name) {
                case 'title':
                    dispatch(setNoteTitle(value))
                    break
                case 'parentId':
                    dispatch(setNoteFolderId(value))
                    break
                case 'description':
                    dispatch(setNoteDescription(value))
                    break
                default:
                    console.log({[name]: value})
            }
        },
        onTagsChange(tags) {
            const reducedTags = tags.map(item => item.value)
            dispatch(setNoteTags(reducedTags))
        },
        onSubmit(note) {
            if (!note.title) {
                return
            }
            else if (!note.description) {
                return
            }

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
                    dispatch(action)
                }
            )
            dispatch(toggleNoteModal())
            dispatch(loadNote({}))
        },
        onCancel(e) {
            dispatch(loadNote({}))
            dispatch(toggleNoteModal())
        }
    })
)(NoteModal)

export const RemoveNoteContainer = connect(
    state => ({
        app: state.app,
        notes: state.notes
    }),
    dispatch => ({
        onRemove(note) {
            dispatch(loadNote(note))
            dispatch(toggleRemoveNoteModal())
        }
    })
)(RemoveNoteButton)

export const RemoveNoteModalContainer = connect(
    state => ({
        app: state.app,
        note: state.note
    }),
    dispatch => ({
        onSubmit(note) {

            if (!note.id) {
                return
            }

            fetch(
                `${apiUrl}/notices/${note.id}`,
                {
                    method: 'DELETE',
                    body: JSON.stringify(note)
                }
            ).then(
                result => {
                    if (result.ok === true) {
                        dispatch(removeNote(note.id))
                        dispatch(selectNote(0))
                    }
                }
            )
            dispatch(loadNote({}))
            dispatch(toggleRemoveNoteModal())
        },
        onCancel(e) {
            dispatch(loadNote({}))
            dispatch(toggleRemoveNoteModal())
        }
    })
)(RemoveNoteModal)

export const SearchFormContainer = connect(
    state => ({
        app: state.app,
        notes: state.notes
    }),
    dispatch => ({
        onChange(e, value)  {
            dispatch(setSearch({q: value, folderId: rootFolderId}))
        },
        onAdvancedChange(e)  {
            dispatch(setSearch({advanced: e.target.checked}))
        },
        onSelect(value) {
            dispatch(setSearch({q: value, folderId: rootFolderId}))
        }
    })
)(SearchForm)
