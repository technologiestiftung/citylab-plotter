import { combineReducers } from 'redux';

import {
  DEFAULT,
  // CONNECT,
  GET_DATA_ERROR,
  POST_DATA_ERROR,
  GET_DATA_RECEIVED,
  POST_DATA_RECEIVED
} from './action-types';

const def = (state: number = 0, action: any) => {
  switch (action.type) {
    case DEFAULT:
    return state + 1;
    default:
    return state;
  }
};

// const connected = (state: boolean = false, action: any)=>{
//   switch(action.type){
//     case CONNECT:
//     return !state;
//     default:
//     return state;
//   }
// }

/**
 * @param {Array} state
 * @param {Object} action
 */
const errors = (state: any[] = [], action: any) => {
  switch (action.type) {
  case GET_DATA_ERROR:
  case POST_DATA_ERROR:
    return [action.error, ...state];
  default:
    return state;
  }
};

const apiState = (state: object = {}, action: any) => {
  switch (action.type) {
    case GET_DATA_RECEIVED:
    console.log('GET_DATA action type ', action.type);
    console.log('GET_DATA action body ', action.body);
    return action.body;
    default:
    return state;
  }
};

const responses = (state: object[] = [], action: any) => {
  switch (action.type) {
    case POST_DATA_RECEIVED:
    console.log('POST_DATA response', action.body);
    return [action.body, ...state];
    default:
    return state;
  }
};


export const reducers = combineReducers({
  // connected,
  apiState,
  def,
  errors,
  responses,
});
