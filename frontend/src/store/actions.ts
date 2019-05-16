import { DEFAULT, GET_DATA, POST_DATA, CONNECT } from './action-types';
import { IObject, IAction, IPostAction } from '../common/interfaces';

export const triggerDefault = (): IAction => {
  // console.log('trigger DEFAULT');
  return {type: DEFAULT};
};

export const triggerConnect = (): IAction => {
  return {type: CONNECT};
};

export const getData = (url?: string): IAction => {
  // console.log('getting data');
  return {type: GET_DATA, url};
};

export const postData = (body: IObject, url?: string): IPostAction => {
  return {type: POST_DATA, body, url};
};

