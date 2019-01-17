import React, {Component} from 'react'
import Folders from './Folders'
import Toolbar from "./Toolbar"
import Notes from "./Notes"
import {apiUrl, rootFolderId} from './constants'
import { fetchFolders, fetchNotes, selectFolder } from "./actions";
import ReactTooltip from 'react-tooltip'

class App extends Component {
    store = {}

    constructor (props) {
        super(props)
        this.store = props.store
    }

    componentDidMount() {
        fetch(`${apiUrl}/directories`)
            .then(result => result.json())
            .then(result => this.store.dispatch(fetchFolders(result)))
            .then(result => this.store.dispatch(selectFolder(rootFolderId)))
        fetch(`${apiUrl}/notices`)
            .then(result => result.json())
            .then(result => {
                this.store.dispatch(fetchNotes(result))
            })
    }

    render() {
        const { folders } = this.store.getState()

        return (
            <div id="app-wrapper">
                <ReactTooltip />
                <div id={'app-header'}>Manager</div>
                <div id={'app-body'}>
                    <Toolbar store={this.store} />
                    <Folders foldersData={folders} store={this.store} />
                    <Notes store={this.store} />
                </div>
                <div id={'app-footer'}>&nbsp;</div>
            </div>
        );
    }
}

export default App
