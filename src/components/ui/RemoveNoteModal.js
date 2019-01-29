import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'

const RemoveNoteModal = ({app = {}, note = {}, onSubmit=f=>f, onCancel=f=>f}) => {
    return (
        <Modal show={app.showRemoveNoteModal}>
            <Modal.Header>
                <Button className={'close'} onClick={onCancel}>&times;</Button>
                <Modal.Title>Remove note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={
                    e => {
                        e.preventDefault()
                        onSubmit(note)
                    }
                } autoComplete={'off'}>
                    <p><label>Remove note "{note.title}"?</label></p>
                    <Button type={'submit'} bsStyle="primary">Remove</Button>
                    <span style={{width: '20px', display: 'inline-block'}}></span>
                    <Button type={'reset'} bsStyle="default" onClick={onCancel}>Cancel</Button>
                </form>
                <p>&nbsp;</p>
            </Modal.Body>
        </Modal>
    )
}

RemoveNoteModal.propTypes = {
    app: PropTypes.object,
    note: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
}

export default RemoveNoteModal
