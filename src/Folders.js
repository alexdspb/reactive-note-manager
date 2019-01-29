import React from 'react';
import './folders.css';
import {Link} from 'react-router-dom'
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
