import {createStore, combineReducers,applyMiddleware} from 'redux'
import {app, folders, notes, folder, note} from './reducers'
import {initialState as stateData, reduxDevTools} from './constants'

const logger = store => next => action => {
    let result
    console.groupCollapsed('dispatching', action.type)
    console.log('prev state', store.getState())
    console.log('action', action)
    result = next(action)
    console.log('next state', store.getState())
    console.groupEnd()
}
const saver = store => next => action => {
    let result = next(action)
    return result
}

const storeFactory = (initialState=stateData) =>
    applyMiddleware(logger, saver)(createStore)(
        combineReducers({app, folders, notes, folder, note}),
        initialState,
        reduxDevTools
    )

export default storeFactory
