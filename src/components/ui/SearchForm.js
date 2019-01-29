import React from 'react'
import PropTypes from 'prop-types'
import {setSearch} from "../../actions";
import Autocomplete from 'react-autocomplete'
import { Link } from 'react-router-dom'

const SearchForm = ({app = {}, notes = [], onChange=f=>f, onAdvancedChange=f=>f, onSelect=f=>f}) => {

    // fetch suggestions from notes content
    var suggestions = [];
    notes.map((note) => {
        if (note.title) {
            note.title.split(' ').map((word) => {
                const cleanWord =  word.replace(/[\.,\?\!]+$/g, '').toLowerCase()
                if (cleanWord.length > 3) {
                    suggestions = suggestions.concat([cleanWord])
                }
                return null
            })
        }
        if (note.description) {
            note.description.split(' ').map((word) => {
                const cleanWord =  word.replace(/[\.,\?\!]+$/g, '').toLowerCase()
                if (cleanWord.length > 3) {
                    suggestions = suggestions.concat([cleanWord])
                }
                return null
            })
        }
        if (note.tags && note.tags.length > 0) {
            suggestions = suggestions.concat(note.tags)
        }
        return null
    })
    suggestions = [...new Set(suggestions)]

    return (
        <form>
            <div data-tip={'Type a text you wish to find.'}>
                <Autocomplete
                    value={app.search.q}
                    items={suggestions}
                    inputProps={{
                        placeholder: 'Search'
                    }}
                    wrapperStyle={{style: {width: '100%'}}}
                    getItemValue={item => item}
                    shouldItemRender={(item, value) => value.length >= 1 ? item.toLowerCase().indexOf(value.toLowerCase()) > -1 : false}
                    renderItem={(item, isHighlighted) =>
                        <div key={item} style={{ backgroundColor: isHighlighted ? '#eee' : 'transparent'}}>
                            <Link to={`/${app.search.advanced ? 'advanced_search' : 'search'}/${item}`} class={'suggestion_link'}>{item}</Link>
                        </div>
                    }
                    onChange={onChange}
                    onSelect={onSelect}
                />
            </div>
            <input type={'checkbox'} name={'advanced'} id={'advanced'} onChange={onAdvancedChange} checked={app.search.advanced}/>
            <label htmlFor={'advanced'} data-tip={'Advanced search includes body and tags.'}>use advanced search</label>
        </form>
    )
}

SearchForm.propTypes = {
    app: PropTypes.object,
    notes: PropTypes.array,
    onChange: PropTypes.func,
    onAdvancedChange: PropTypes.func,
    onSelect: PropTypes.func
}

export default SearchForm
