import {actionsNames, apiUrl, rootFolderId} from './constants'
import {folderExist, getNoteById, getRequest, noteExist} from './utils'

/* app */

export const selectFolder = id => {
    return ({
        type: actionsNames.SELECT_FOLDER,
        id
    })
}

export const selectNote = id => {
    return ({
        type: actionsNames.SELECT_NOTE,
        id
    })
}

export const toggleFolderModal = () => {
    return ({
        type: actionsNames.TOGGLE_FOLDER_MODAL,
    })
}

export const toggleRemoveFolderModal = () => {
    return ({
        type: actionsNames.TOGGLE_REMOVE_FOLDER_MODAL,
    })
}

export const toggleNoteModal = () => {
    return ({
        type: actionsNames.TOGGLE_NOTE_MODAL,
    })
}

export const toggleRemoveNoteModal = () => {
    return ({
        type: actionsNames.TOGGLE_REMOVE_NOTE_MODAL,
    })
}

export const setSearch = (search) => {
    return ({
        type: actionsNames.SET_SEARCH,
        search
    })
}

export const dragNote = (id = 0) => {
    return ({
        type: actionsNames.DRAG_NOTE,
        id
    })
}

/* folders */

export const requestFolders = (match) => {
    return (dispatch) => {
        return getRequest(`${apiUrl}/directories`).then(
            response => {
                dispatch(fetchFolders(response.data))
                // select folder that passed through url
                const folderId = (match.path === '/folder/:id' && match.isExact && folderExist(parseInt(match.params.id, 10), response.data)) ? parseInt(match.params.id, 10) : null
                if (folderId) {
                    dispatch(selectFolder(folderId))
                    dispatch(setSearch({folderId: folderId, q: ''}))
                }
            }
        )
    }
}

export const fetchFolders = foldersData => {
    return ({
        type: actionsNames.FETCH_FOLDERS,
        foldersData
    })
}

export const addFolder = folder => {
    return ({
        type: actionsNames.ADD_FOLDER,
        folder
    })
}

export const editFolder = folder => {
    return ({
        type: actionsNames.EDIT_FOLDER,
        folder
    })
}

export const removeFolder = id => {
    return ({
        type: actionsNames.REMOVE_FOLDER,
        id
    })
}

/* notes */

export const requestNotes = (match) => {
    return (dispatch) => {
        return getRequest(`${apiUrl}/notices`).then(
            response => {
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
            }
        )
    }
}

export const fetchNotes = notes => {
    return ({
        type: actionsNames.FETCH_NOTES,
        notes
    })
}

export const addNote = note => {
    return ({
        type: actionsNames.ADD_NOTE,
        note
    })
}

export const editNote = note => {
    return ({
        type: actionsNames.EDIT_NOTE,
        note
    })
}

export const removeNote = id => {
    return ({
        type: actionsNames.REMOVE_NOTE,
        id
    })
}

export const reorderNotes = notes => {
    return ({
        type: actionsNames.REORDER_NOTES,
        notes
    })
}

/* folder */

export const loadFolder = folder => {
    return ({
        type: actionsNames.LOAD_FOLDER,
        folder
    })
}

export const setFolderName = name => {
    return ({
        type: actionsNames.SET_FOLDER_NAME,
        name
    })
}

/* note */

export const loadNote = note => {
    return ({
        type: actionsNames.LOAD_NOTE,
        note
    })
}

export const setNoteFolderId = folderId => {
    return ({
        type: actionsNames.SET_NOTE_FOLDER_ID,
        folderId
    })
}

export const setNoteTitle = title => {
    return ({
        type: actionsNames.SET_NOTE_TITLE,
        title
    })
}

export const setNoteDescription = description => {
    return ({
        type: actionsNames.SET_NOTE_DESCRIPTION,
        description
    })
}

export const setNoteTags = tags => {
    return ({
        type: actionsNames.SET_NOTE_TAGS,
        tags
    })
}

