import axios from 'axios'


export const getFolderById = (id, folders) => {
    const [folder] = folders.filter(folder => folder.id === id)
    return folder
}

export const folderExist = (id, folders) => (typeof getFolderById(id, folders) === 'object')


export const getNoteById = (id, notes) => {
    const [note] = notes.filter(note => note.id === id)
    return note
}

export const noteExist = (id, notes) => (typeof getNoteById(id, notes) === 'object')


export const getRequest = (url, params = {}) => {
    const request = {
        url,
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        params
    }
    return axios.request(request)
}