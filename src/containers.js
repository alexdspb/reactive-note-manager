import { connect } from 'react-redux'
import AddFolderButton from './components/ui/AddFolderButton'
import EditFolderButton from './components/ui/EditFolderButton'
import RemoveFolderButton from './components/ui/RemoveFolderButton'
import FolderModal from './components/ui/FolderModal'
import RemoveFolderModal from './components/ui/RemoveFolderModal'
import {
    addFolder,
    editFolder,
    loadFolder,
    removeFolder,
    selectFolder,
    setFolderName,
    toggleFolderModal,
    toggleRemoveFolderModal
} from './actions'
import {apiUrl, rootFolderId} from './constants'

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

