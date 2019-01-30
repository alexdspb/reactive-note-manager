import React from 'react';
import './folders.css';
import { FolderItemContainer } from './containers'

const Folders = () => {
    return (
        <div id={'folders-list'}>
            <ul>
                <FolderItemContainer />
            </ul>
        </div>
    )
}

export default Folders;
