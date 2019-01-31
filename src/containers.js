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
import NotesList from './components/ui/NotesList'
import Note, {dndNoteSource, dndNoteTarget} from './components/ui/Note'

import {
    addFolder,
    addNote,
    editFolder,
    editNote,
    fetchFolders,
    fetchNotes,
    reorderNotes,
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
    toggleRemoveNoteModal, dragNote
} from './actions'
import {apiUrl, rootFolderId, dndTypes} from './constants'
import {folderExist, getNoteById, noteExist} from "./utils";

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {DragSource, DropTarget} from 'react-dnd'
import axios from 'axios'

export const HomeContainer = connect(
    state => ({
        app: state.app,
        folders: state.folders,
        notes: state.notes
    }),
    dispatch => ({
        async onDidMount(match, folders, notes) {
            try {
                const response = await axios.get(`${apiUrl}/directories`)
                dispatch(fetchFolders(response.data))
                // select folder that passed through url
                const folderId = (match.path === '/folder/:id' && match.isExact && folderExist(parseInt(match.params.id, 10), response.data)) ? parseInt(match.params.id, 10) : rootFolderId
                dispatch(selectFolder(folderId))
                dispatch(setSearch({folderId: folderId, q: ''}))
            } catch (error) {
                console.error(error)
            }
            try {
                const response = await axios.get(`${apiUrl}/notices`)
                dispatch(fetchNotes(response.data))
                // select and edit the note that passed through url
                if (match.path === '/note/:id' && match.isExact && noteExist(parseInt(match.params.id, 10), response.data)) {
                    const noteId = parseInt(match.params.id, 10)
                    dispatch(selectNote(noteId))
                    // show edit modal dialog
                    const note = getNoteById(noteId, response.data)
                    dispatch(loadNote(note))
                    dispatch(toggleNoteModal())
                }
                // search notes by the query that passed through url
                if (match.path === '/search/:q' && match.isExact) {
                    dispatch(setSearch({q: match.params.q}))
                } else if (match.path === '/advanced_search/:q' && match.isExact) {
                    dispatch(setSearch({q: match.params.q, advanced: true}))
                }
            } catch (error) {
                console.error(error)
            }
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
        async onSubmit(folder) {

            if (!folder.name || folder.name === '') {
                return
            }


            try {
                const request = folder.id ? {
                    url: `${apiUrl}/directories/${folder.id}`,
                    method: 'put',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: folder
                } : {
                    url: `${apiUrl}/directories`,
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: folder
                }
                const response = await axios.request(request)

                const action = folder.id ? editFolder(response.data) : addFolder(response.data)
                dispatch(action)
            } catch (error) {
                console.error(error)
            }

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
        async onSubmit(folder) {

            if (!folder.id) {
                return
            }

            try {
                const request = {
                    url: `${apiUrl}/directories/${folder.id}`,
                    method: 'delete',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: folder
                }
                const response = await axios.request(request)

                dispatch(removeFolder(folder.id))
                dispatch(selectFolder(rootFolderId))
            } catch (error) {
                console.error(error)
            }

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
        async onSaveName(name, folder) {
            try {
                const request = {
                    url: `${apiUrl}/directories/${folder.id}`,
                    method: 'put',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: {...folder, name: name}
                }
                const response = await axios.request(request)

                dispatch(editFolder(response.data))
            } catch (error) {
                console.error(error)
            }
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
        async onSubmit(note) {
            if (!note.title) {
                return
            }
            else if (!note.description) {
                return
            }

            try {
                const request = note.id ? {
                    url: `${apiUrl}/notices/${note.id}`,
                    method: 'put',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: note
                } : {
                    url: `${apiUrl}/notices`,
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: note
                }
                const response = await axios.request(request)

                const action = note.id ? editNote(response.data) : addNote(response.data)
                dispatch(action)
            } catch (error) {
                console.error(error)
            }

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
        async onSubmit(note) {

            if (!note.id) {
                return
            }

            try {
                const request = {
                    url: `${apiUrl}/notices/${note.id}`,
                    method: 'delete',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: note
                }
                const response = await axios.request(request)

                dispatch(removeNote(note.id))
                dispatch(selectNote(0))
            } catch (error) {
                console.error(error)
            }

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

export const NotesListContainer = connect(
    state => ({
        app: state.app,
        notes: state.notes
    }),
    dispatch => ({
        onReorder(notes) {
            dispatch(reorderNotes(notes))
        }
    })
)(DragDropContext(HTML5Backend)(NotesList))

export const NoteContainer = connect(
    state => ({
        app: state.app,
        notes: state.notes
    }),
    dispatch => ({
        onClick(note) {
            dispatch(selectNote(note.id))
        },
        onDoubleClick(note) {
            dispatch(loadNote(note))
            dispatch(toggleNoteModal())
        },
        onDragStart(id) {
            dispatch(dragNote(id))
        },
        onDragEnd(notes) {
            for (const note of notes) {
                try {
                    const request = {
                        url: `${apiUrl}/notices/${note.id}`,
                        method: 'put',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        data: note
                    }
                    const response = axios.request(request)
                } catch (error) {
                    console.log(error)
                }
            }
            dispatch(dragNote())
        }
    })
)(DropTarget(
    dndTypes.NOTE,
    dndNoteTarget,
    connect => ({
        connectDropTarget: connect.dropTarget()
    })
)(
    DragSource(
        dndTypes.NOTE,
        dndNoteSource,
        (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging()
        })
    )(Note)
))
