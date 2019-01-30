import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import CreatableSelect from 'react-select/lib/Creatable'

const getAllTags = (notes) => {
    let tags = [];
    notes.map((note) => {
        if (note.tags && note.tags.length > 0) {
            tags = tags.concat(note.tags)
        }
        return null
    })

    return [...new Set(tags)].map(item => ({label: item, value: item}))
}

const NoteModal = ({app = {}, note = {}, notes = [], onChange=f=>f, onTagsChange=f=>f, onSubmit=f=>f, onCancel=f=>f}) => {
    const options = getAllTags(notes)
    const noteTags = note.tags ? note.tags.map(item => ({label: item, value: item})) : []

    return (
        <Modal show={app.showNoteModal}>
            <Modal.Header>
                <Button className={'close'} onClick={onCancel}>&times;</Button>
                <Modal.Title>{note.id ? 'Edit' : 'Add'} note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={
                    e => {
                        e.preventDefault()
                        onSubmit(note)
                    }
                } autoComplete={'off'}>
                    <input type={'hidden'} />
                    <label>Title</label><br />
                    <input required type={'text'} name={'title'} value={note.title} onChange={onChange} autoFocus={true} /><br />
                    <br />
                    <label>Description</label><br />
                    <textarea required name={'description'} value={note.description} rows={5} onChange={onChange} /><br />
                    <br />
                    <label>Tags</label><br />
                    <CreatableSelect
                        isClearable
                        isMulti
                        options={options}
                        defaultValue={noteTags}
                        onChange={(value, { action, removedValue }) => onTagsChange(value)}
                    />
                    <br /><br />
                    <Button type={'submit'} bsStyle="primary">{note.id ? 'Save' : 'Add'}</Button>
                    <span style={{width: '20px', display: 'inline-block'}}></span>
                    <Button type={'reset'} bsStyle="default" onClick={onCancel}>Cancel</Button>
                </form>
                <p>&nbsp;</p>
            </Modal.Body>
        </Modal>
    )
}

NoteModal.propTypes = {
    app: PropTypes.object,
    note: PropTypes.object,
    notes: PropTypes.array,
    onChange: PropTypes.func,
    onTagsChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
}

export default NoteModal