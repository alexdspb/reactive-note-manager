import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'

const RemoveFolderModal = ({app = {}, folder = {}, onSubmit=f=>f, onCancel=f=>f}) => {
    return (
        <Modal show={app.showRemoveFolderModal}>
            <Modal.Header>
                <Button className={'close'} onClick={onCancel}>&times;</Button>
                <Modal.Title>Remove folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={
                    e => {
                        e.preventDefault()
                        onSubmit(folder)
                    }
                } autoComplete={'off'}>
                    <p><label>Remove folder "{folder.name}"?</label></p>
                    <Button type={'submit'} bsStyle="primary">Remove</Button>
                    <span style={{width: '20px', display: 'inline-block'}}></span>
                    <Button type={'reset'} bsStyle="default" onClick={onCancel}>Cancel</Button>
                </form>
                <p>&nbsp;</p>
            </Modal.Body>
        </Modal>
    )
}

RemoveFolderModal.propTypes = {
    app: PropTypes.object,
    folder: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
}

export default RemoveFolderModal
