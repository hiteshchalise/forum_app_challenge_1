import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import posts from './posts';

const reducer = combineReducers({ user, posts });
const store = configureStore({ reducer })

export default store;