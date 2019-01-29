import React, { Component } from 'react';
import './toolbar.css';
import { AddFolderContainer, EditFolderContainer, RemoveFolderContainer, FolderModalContainer, RemoveFolderModalContainer } from './containers'


class Toolbar extends Component {
    render() {
        return (
            <div id={'toolbar'}>
                <AddFolderContainer />
                <EditFolderContainer />
                <RemoveFolderContainer />
                <FolderModalContainer />
                <RemoveFolderModalContainer />
            </div>
        );
    }
}

export default Toolbar;
