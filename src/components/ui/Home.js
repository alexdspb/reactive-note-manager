import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {apiUrl, rootFolderId} from "../../constants";
import {fetchFolders, fetchNotes, loadNote, selectFolder, selectNote, setSearch, toggleNoteModal} from "../../actions";
import {folderExist, getNoteById, noteExist} from "../../utils";
import Toolbar from "../../Toolbar";
import Folders from "../../Folders";
import Notes from "../../Notes";

class Home extends Component {

    componentDidMount() {
        const {match, folders, notes} = this.props
        this.props.onDidMount(match, folders, notes)
    }

    render() {
        return (
            <div>
                <Toolbar />
                <Folders />
            </div>
        );
    }
}

Home.propTypes = {
    app: PropTypes.object,
    folders: PropTypes.array,
    notes: PropTypes.array,
    onDidMount: PropTypes.func
}

export default Home
