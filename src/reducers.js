import { actionsNames, rootFolderId } from "./constants"

export const app = (state = {}, action) => {
    switch (action.type) {
        case actionsNames.SELECT_FOLDER:
            return {...state, selectedFolderId: action.id}
        case actionsNames.SELECT_NOTE:
            return {...state, selectedNoteId: action.id}
        case actionsNames.TOGGLE_FOLDER_MODAL:
            return {...state, showFolderModal: !state.showFolderModal}
        case actionsNames.TOGGLE_REMOVE_FOLDER_MODAL:
            return {...state, showRemoveFolderModal: !state.showRemoveFolderModal}
        case actionsNames.TOGGLE_NOTE_MODAL:
            return {...state, showNoteModal: !state.showNoteModal}
        case actionsNames.TOGGLE_REMOVE_NOTE_MODAL:
            return {...state, showRemoveNoteModal: !state.showRemoveNoteModal}
        case actionsNames.SET_SEARCH:
            return {...state, search: {...state.search, ...action.search}}
        case actionsNames.DRAG_NOTE:
            return {...state, dragNoteId: action.id}
        default:
            return state
    }
}

export const folders = (state = [], action) => {
    switch (action.type) {
        case actionsNames.FETCH_FOLDERS:
            return action.foldersData
        case actionsNames.ADD_FOLDER:
            return [...state, action.folder]
        case actionsNames.EDIT_FOLDER:
            if (!action.folder.id || !action.folder.name || !action.folder.parentId || action.folder.id === rootFolderId) {
                // do not edit incomplete folders or root folder
                return state
            }
            return state.map(
                (item) => item.id === action.folder.id ? {id: item.id, parentId: action.folder.parentId, name: action.folder.name} : item
            )
        case actionsNames.REMOVE_FOLDER:
            return state.filter(item => item.id !== action.id)
        default:
            return state
    }
}


export const notes = (state = [], action) => {
    switch (action.type) {
        case actionsNames.FETCH_NOTES:
            return action.notes
        case actionsNames.ADD_NOTE:
            return [...state, action.note]
        case actionsNames.EDIT_NOTE:
            if (action.note.id  && action.note.directoryId && action.note.title) {
                return state.map(
                    (item) => item.id === action.note.id ? {...item, ...action.note} : item
                )
            }
            return state
        case actionsNames.REMOVE_NOTE:
            return state.filter(item => item.id !== action.id)
        case actionsNames.REORDER_NOTES:
            return action.notes
        default:
            return state
    }
}

export const folder = (state = {}, action) => {
    switch (action.type) {
        case actionsNames.LOAD_FOLDER:
            return action.folder
        case actionsNames.SET_FOLDER_NAME:
            return {...state, name: action.name}
        default:
            return state
    }
}

export const note = (state = {}, action) => {
    switch (action.type) {
        case actionsNames.LOAD_NOTE:
            return action.note
        case actionsNames.SET_NOTE_FOLDER_ID:
            return {...state, directoryId: action.folderId}
        case actionsNames.SET_NOTE_TITLE:
            return {...state, title: action.title}
        case actionsNames.SET_NOTE_DESCRIPTION:
            return {...state, description: action.description}
        case actionsNames.SET_NOTE_TAGS:
            return {...state, tags: action.tags}
        default:
            return state
    }
}

