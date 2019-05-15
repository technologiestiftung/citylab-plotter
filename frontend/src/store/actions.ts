import { DEFAULT, GET_DATA, POST_DATA, CONNECT } from './action-types';

interface IAction {
  type: string;
}

interface IPostAction extends IAction {
  body: object;
}
export const triggerDefault = (): IAction => {
  console.log('trigger DEFAULT');
  return {type: DEFAULT};
};

export const triggerConnect = (): IAction => {
  return {type: CONNECT};
};

export const getData = (): IAction => {
  console.log('getting data');
  return {type: GET_DATA};
};

export const postData = (body: object): IPostAction => {
  return {type: POST_DATA, body};
};

