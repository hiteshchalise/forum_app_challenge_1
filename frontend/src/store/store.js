import { createStore, combineReducers } from 'redux';
import user from './user';
import posts from './posts';

const store = createStore(combineReducers({ user, posts }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
console.log("Store: State:", store.getState());

export default store;