import { DEFAULT, GET_DATA, POST_DATA, CONNECT } from './action-types';

interface IAction {
  type: string;
  url?: string;
}
interface IObject {
  [key: string]: any;
}
interface IPostAction extends IAction {
  body: IObject;
  // url?: string;
}
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

