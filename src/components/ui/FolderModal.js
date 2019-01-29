import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'

const FolderModal = ({app = {}, folder = {}, onChange=f=>f, onSubmit=f=>f, onCancel=f=>f}) => {
    return (
        <Modal show={app.showFolderModal}>
            <Modal.Header>
                <Button className={'close'} onClick={onCancel}>&times;</Button>
                <Modal.Title>{folder && folder.id ? 'Edit' : 'Add'} folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={
                    e => {
                        e.preventDefault()
                        onSubmit(folder)
                    }
                } autoComplete={'off'}>
                    <label>Name</label><br />
                    <input required type={'text'} name={'name'} value={folder.name} onChange={onChange} autoFocus={true} /><br />
                    <br />
                    <Button type={'submit'} bsStyle="primary">{folder && folder.id ? 'Save' : 'Add'}</Button>
                    <span style={{width: '20px', display: 'inline-block'}}></span>
                    <Button type={'reset'} bsStyle="default" onClick={onCancel}>Cancel</Button>
                </form>
                <p>&nbsp;</p>
            </Modal.Body>
        </Modal>
    )
}

FolderModal.propTypes = {
    app: PropTypes.object,
    folder: PropTypes.object,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
}

export default FolderModal