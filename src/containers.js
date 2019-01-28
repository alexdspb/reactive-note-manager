import { connect } from 'react-redux'
import AddFolderButton from './components/ui/AddFolderButton'
import {loadFolder, toggleFolderModal} from './actions'

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