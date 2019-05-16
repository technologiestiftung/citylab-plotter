import 'babel-polyfill'; // needed for ie11 should be the first things
import 'whatwg-fetch'; // needed for ie11 should be the first things
// import superagent from 'superagent';
const apiUrl = `http://localhost:${process.env.API_PORT}`;
import { store } from './store/store';
import { postData } from './store/actions';
import { IObject } from './common/interfaces';

const ws: WebSocket = new WebSocket(`ws://localhost:${process.env.API_PORT}`);


const responseRender: (obj: IObject, target: HTMLElement) => void = (obj, target) => {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = JSON.stringify(obj, null, 2);
  pre.append(code);
  target.prepend(pre);
}


const render = () => {
  try {
    const state = store.getState();
    const responses = state.responses;
    let { portIsOpen, currentPort } = state.responses[0].appState;

    const statusConnected: HTMLElement | null = document.querySelector('#connectionState');
    const statusPort: HTMLElement | null = document.querySelector('#currentPortInfos');
    const responseTarget: HTMLElement | null = document.querySelector('section.responses');

    if (statusConnected !== null) {
      if (portIsOpen === true) {
        statusConnected.textContent = 'Connected';
        statusConnected.classList.add('is-connected');
      } else {
        statusConnected.textContent = 'Not Connected';
        statusConnected.classList.remove('is-connected');
      }
    } else {
      console.error('could not find `div#connectionState`')
    }


    if (statusPort !== null) {
      statusPort.textContent = currentPort;
      if (portIsOpen === true) {
        statusPort.classList.add('is-connected');
      } else {
        statusPort.classList.remove('is-connected');
      }
    } else {
      console.error('could not find `div#connectionState`')
    }


    if (responseTarget !== null) {
      if (responses.length > 0) {
        const res = Object.assign({}, responses[0]);
        delete res.appState;
        responseRender(res, responseTarget);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  store.subscribe(render);
  // store.dispatch(getData());
  store.dispatch(postData({ getAppState: 'foo' }, `${apiUrl}`))
  render();
  const singleForm: HTMLFormElement | null = document.querySelector('form#single');

  singleForm!.onsubmit = function (_e: any) {
    return false;
  }

  const buttonMultiline: HTMLButtonElement | null = document.querySelector('input.button--multi');
  const buttonSingle: HTMLButtonElement | null = document.querySelector('input.button--single');
  const inputSingle: HTMLInputElement | null = document.querySelector('input.input--single');
  const buttonConnect: HTMLButtonElement | null = document.querySelector('button#connect');
  const buttonHomeing: HTMLButtonElement | null = document.querySelector('button#homeing');
  const buttonUnlock: HTMLButtonElement | null = document.querySelector('button#unlock');
  const buttonDisconnect: HTMLButtonElement | null = document.querySelector('button#disconnect');
  const responseTarget: HTMLElement | null = document.querySelector('section.responses');


  if (responseTarget !== null) {
    ws.onmessage = (message) => {

      responseRender({ message: message.data, type: 'socket' }, responseTarget!);
    };

    if (buttonConnect !== null) {
      buttonConnect.addEventListener('click', (event) => {
        event.preventDefault();
        store.dispatch(postData({ connect: true }, `${apiUrl}/connect`));
      });
    }
    if (buttonDisconnect !== null) {
      buttonDisconnect.addEventListener('click', (event) => {
        event.preventDefault();
        store.dispatch(postData({ connect: false }, `${apiUrl}/disconnect`));
      });
    }
    if (buttonHomeing !== null) {
      buttonHomeing.addEventListener('click', (event) => {
        event.preventDefault();
        store.dispatch(postData({}, `${apiUrl}/home`));
      });
    }
    if (buttonUnlock !== null) {
      buttonUnlock.addEventListener('click', (event) => {
        event.preventDefault();
        store.dispatch(postData({}, `${apiUrl}/unlock`));
      });
    }
    if (buttonMultiline !== null) {
      buttonMultiline.addEventListener('click', (event) => {
        event.preventDefault();
        const area: HTMLTextAreaElement | null = document.querySelector('textarea.input--multi');
        if (area !== null) {
          area.value = area.value.replace(/\n\s*\n/g, '\n');
          area.value = area.value.replace(/^\s+/g, '');
          if (area.value.endsWith('\n') === false) {
            area.value = `${area.value}\n`;
          }
          const commands = area.value;
          store.dispatch(postData({ command: commands }, `${apiUrl}`));
        } else {
          console.error('could not find textarea');
        }
      });
    }

    if (inputSingle !== null) {
      inputSingle.addEventListener('keypress', (event) => {
        var key = event.charCode || event.keyCode || 0;
        if (key == 13) {
          inputSingle.value;
          store.dispatch(postData({ command: `${inputSingle.value}\n` }, `${apiUrl}`))
        }
      });
    }

    if (buttonSingle !== null) {
      buttonSingle.addEventListener('click', (event) => {
        event.preventDefault();
        const input: HTMLInputElement | null = document.querySelector('input.input--single');
        if (input !== null) {
          input.value;
          store.dispatch(postData({ command: `${input.value}\n` }, `${apiUrl}`))
        }
      });
    }
  } else {
    throw new Error('The target container `section.responses` does not exist');
  }
});