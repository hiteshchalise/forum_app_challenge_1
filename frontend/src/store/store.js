import { createStore, combineReducers } from 'redux';
import user from './auth';

const store = createStore(combineReducers({ user }));
console.log("Store: State:", store.getState());

export default store;