import { IOption, IParseError } from '../common/interfaces';
import { GET_DATA, POST_DATA } from './action-types';

const defaultOptions = {
  async: true,
  method: 'GET',
  type: 'DEFAULT',
  url: `http://${window.location.hostname}:${process.env.API_PORT}`,
};

const request = (next: any) => (opts?: IOption) => {

  const option = Object.assign({}, defaultOptions, opts);
  const xhr: XMLHttpRequest = new XMLHttpRequest();
  xhr.open(option.method, option.url, true);
  if (option.formData === undefined) {
    xhr.setRequestHeader('Content-type', 'application/json');
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let responseText: object | IParseError;
      try {
        responseText = JSON.parse(xhr.responseText);
        // console.log(responseText);
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
        responseText = { raw: xhr.responseText, err };
      }
      if (xhr.status === 200) {
        // success we got an answer with status 200
        // dispatch an actoin with its content
        // follow this action to
        // the response for the POST request actually
        // lands on neverland…
        // console.log(`${option.type}_RECEIVED`);

        return next({
          body: responseText,
          type: `${option.type}_RECEIVED`,
        });
      } else {
        // we count any other status then 200 as error
        // so we dispatch and error message for that
        // follow it to
        // lib/reducers/error.js
        return next({
          error: {
            message: responseText,
            status: xhr.status,
          },
          type: `${option.type}_ERROR`,
        });
      }
    }
  };
  // if we have a body
  if (option.body !== undefined || option.formData !== undefined) {
    // console.log('send with body');
    // send it
    // this is POST
    // console.log(option.body);
    if (option.formData !== undefined) {
      console.log('Sending from data');
      console.log(option.formData);
      xhr.send(option.formData);
    } else {
      console.log(option.body);
      xhr.send(JSON.stringify(option.body));
    }

  } else {
    // if we have no body we are making a GET request
    xhr.send();
  }
};

// this is not strongly typed
//  needs some love
export type IMiddleware = (store: any) => (next: any) => (action: any) => any;
export const middleware: IMiddleware = (store) => (next) => (action) => {
  next(action);
  const req = request(next);
  switch (action.type) {
    case GET_DATA:
      // tslint:disable-next-line:no-console
      // console.log(action, ' in middleware');
      req({
        async: true,
        method: 'GET',
        type: GET_DATA,
        url: action.url === undefined ? `http://${window.location.hostname}:${process.env.API_PORT}` : action.url,
      });
      break;
    case POST_DATA:
      console.log(action);
      req({
        async: true,
        body: action.body,
        formData: action.body.formData !== undefined ? action.body.formData : undefined,
        method: 'POST',
        type: POST_DATA,
        url: action.url === undefined ? `http://${window.location.hostname}:${process.env.API_PORT}` : action.url,
      });
      break;
    default:
      break;
  }
};
