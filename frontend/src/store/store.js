import { createStore } from 'redux';
import authReducer from './auth';

const store = createStore(authReducer);

export default store;