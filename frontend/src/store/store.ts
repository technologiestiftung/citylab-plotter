import throttle from 'lodash.throttle';
import {applyMiddleware, compose, createStore} from 'redux';
import { loadState, saveState } from './local-storage';
import {middleware} from './middleware';
import {reducers} from './root-reducer';

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedState = loadState();
export const store = createStore(
  reducers,
  persistedState,
  composeEnhancers(applyMiddleware(middleware)),
);

store.subscribe(throttle(() => {
  saveState(store.getState());
}, 1000));

