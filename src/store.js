import {createStore, combineReducers,applyMiddleware} from 'redux'
import {app, folders, notes, folder, note} from './reducers'
import {initialState as stateData, reduxDevTools} from './constants'
import thunk from 'redux-thunk'

const storeFactory = (initialState=stateData) =>
    applyMiddleware(thunk)(createStore)(
        combineReducers({app, folders, notes, folder, note}),
        initialState,
        reduxDevTools
    )

export default storeFactory
