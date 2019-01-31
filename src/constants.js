
export const apiUrl = 'http://192.168.56.101:3001'

export const initialState = {
    app: {
        search: {
            q: '',
            advanced: false
        }
    },
    folders: [],
    notes: [],
    folder: {},
    note: {}
}

export const actionsNames = {
    // folders
    FETCH_FOLDERS: 'FETCH_FOLDERS',
    ADD_FOLDER: 'ADD_FOLDER',
    EDIT_FOLDER: 'EDIT_FOLDER',
    REMOVE_FOLDER: 'REMOVE_FOLDER',
    SELECT_FOLDER: 'SELECT_FOLDER',
    SELECT_NOTE: 'SELECT_NOTE',
    SET_SEARCH: 'SET_SEARCH',

    // app
    TOGGLE_FOLDER_MODAL: 'TOGGLE_FOLDER_MODAL',
    TOGGLE_REMOVE_FOLDER_MODAL: 'TOGGLE_REMOVE_FOLDER_MODAL',
    TOGGLE_NOTE_MODAL: 'TOGGLE_NOTE_MODAL',
    TOGGLE_REMOVE_NOTE_MODAL: 'TOGGLE_REMOVE_NOTE_MODAL',
    DRAG_NOTE: 'DRAG_NOTE',

    // notes
    FETCH_NOTES: 'FETCH_NOTES',
    ADD_NOTE: 'ADD_NOTE',
    EDIT_NOTE: 'EDIT_NOTE',
    REMOVE_NOTE: 'REMOVE_NOTE',
    REORDER_NOTES: 'REORDER_NOTES',

    // folder
    LOAD_FOLDER: 'LOAD_FOLDER',
    SET_FOLDER_NAME: 'SET_FOLDER_NAME',

    // note
    LOAD_NOTE: 'LOAD_NOTE',
    SET_NOTE_FOLDER_ID: 'SET_NOTE_FOLDER_ID',
    SET_NOTE_TITLE: 'SET_NOTE_TITLE',
    SET_NOTE_DESCRIPTION: 'SET_NOTE_DESCRIPTION',
    SET_NOTE_TAGS: 'SET_NOTE_TAGS'
}

export const rootFolderId = 1

export const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

export const dndTypes = {
    NOTE: 'NOTE'
}
