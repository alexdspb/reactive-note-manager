import React, {Component} from 'react'
import Folders from './Folders'
import Toolbar from "./Toolbar"
import Notes from "./Notes"
import {apiUrl, rootFolderId} from './constants'
import {fetchFolders, fetchNotes, loadNote, selectFolder, selectNote, setSearch, toggleNoteModal} from "./actions";
import ReactTooltip from 'react-tooltip'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import {folderExist, getNoteById, noteExist} from './utils'


const Error404 = ({location}) => {
    return (
        <ul>
            <li><h3>Path not found: {location.pathname}</h3></li>
            <li><Link to={'/'}>Proceed to home</Link></li>
        </ul>
    )
}

const Error500 = ({location}) => {
    return (
        <ul>
            <li><h3>Server error (500)!</h3></li>
            <li><Link to={'/'}>Proceed to home</Link></li>
        </ul>
    )
}

export const AppRouter = props => {
    return (
        <Router>
            <Switch>
                <Route exact path={'/'} component={Home} />
                <Route path={'/folder/:id'} component={Home} />
                <Route path={'/note/:id'} component={Home} />
                <Route path={'/search/:q'} component={Home} />
                <Route path={'/advanced_search/:q'} component={Home} />
                <Route component={Error404} />
            </Switch>
        </Router>
    )
}

export const AppWrapper = ({children}) => {
    return (
        <div id="app-wrapper">
            <ReactTooltip />
            <div id={'app-header'}><a href={'/'}>Manager</a></div>
            <div id={'app-body'}>
                {children}
            </div>
            <div id={'app-footer'}>&nbsp;</div>
        </div>
    )
}

class Home extends Component {
    store = {}

    constructor (props) {
        super(props)
        this.store = window.store
    }

    componentDidMount() {


        fetch(`${apiUrl}/directories`)
            .then(result => result.json())
            .then(result => this.store.dispatch(fetchFolders(result)))
            .then(result => {
                const {folders} = this.store.getState()
                const {match} = this.props
                // select folder that passed through url
                const folderId = (match.path === '/folder/:id' && match.isExact && folderExist(parseInt(match.params.id, 10), folders)) ? parseInt(match.params.id, 10) : rootFolderId
                this.store.dispatch(selectFolder(folderId))
                this.store.dispatch(setSearch({folderId: folderId, q: ''}))
            })
        fetch(`${apiUrl}/notices`)
            .then(result => result.json())
            .then(result => {
                this.store.dispatch(fetchNotes(result))
            })
            .then(result => {
                const {notes} = this.store.getState()
                const {match} = this.props
                // select and edit the note that passed through url
                if (match.path === '/note/:id' && match.isExact && noteExist(parseInt(match.params.id, 10), notes)) {
                    const noteId = parseInt(match.params.id, 10)
                    this.store.dispatch(selectNote(noteId))
                    // show edit modal dialog
                    const note = getNoteById(noteId, notes)
                    this.store.dispatch(loadNote(note))
                    this.store.dispatch(toggleNoteModal())
                }
                // search notes by the query that passed through url
                if (match.path === '/search/:q' && match.isExact) {
                    this.store.dispatch(setSearch({q: match.params.q}))
                } else if (match.path === '/advanced_search/:q' && match.isExact) {
                    this.store.dispatch(setSearch({q: match.params.q, advanced: true}))
                }
            })
    }

    render() {
        const { folders, notes } = this.store.getState()

        return (
            <div>
                <Toolbar store={this.store} />
                <Folders
                    foldersData={folders}
                    store={this.store}
                />
                <Notes store={this.store} notes={notes} />
            </div>
        );
    }
}

export default AppRouter
