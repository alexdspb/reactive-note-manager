import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {AppWrapper, AppRouter} from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, combineReducers } from 'redux'
import { app, folders, notes, note } from './reducers'
import { initialState, reduxDevTools } from "./constants";

const store = createStore(combineReducers({app, folders, notes, note}), initialState, reduxDevTools)
window.store = store

const render = () => {
    ReactDOM.render(
        <AppWrapper store={store} >
            <AppRouter/>
        </AppWrapper>,
        document.getElementById('root')
    )
}

store.subscribe(render)
render()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
