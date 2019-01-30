import React, {Component} from 'react'
import Folders from './Folders'
import Toolbar from "./Toolbar"
import Notes from "./Notes"
import {apiUrl, rootFolderId} from './constants'
import {fetchFolders, fetchNotes, loadNote, selectFolder, selectNote, setSearch, toggleNoteModal} from "./actions";
import ReactTooltip from 'react-tooltip'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import {folderExist, getNoteById, noteExist} from './utils'
import {HomeContainer} from "./containers";


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
                <Route exact path={'/'} component={HomeContainer} />
                <Route path={'/folder/:id'} component={HomeContainer} />
                <Route path={'/note/:id'} component={HomeContainer} />
                <Route path={'/search/:q'} component={HomeContainer} />
                <Route path={'/advanced_search/:q'} component={HomeContainer} />
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

export default AppRouter
