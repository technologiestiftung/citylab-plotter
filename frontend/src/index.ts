import 'babel-polyfill'; // needed for ie11 should be the first things
import 'whatwg-fetch'; // needed for ie11 should be the first things
// import superagent from 'superagent';
const apiUrl = `http://localhost:${process.env.API_PORT}`;
import { IObject } from './common/interfaces';
import { postData } from './store/actions';
import { store } from './store/store';

const ws: WebSocket = new WebSocket(`ws://localhost:${process.env.API_PORT}`);

const responseRender: (obj: IObject, target: HTMLElement) => void = (obj, target) => {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  // console.log();
  try {
    const json = JSON.parse(obj.message);
    if (json.hasOwnProperty('gcode') === true) {
      const tarea: HTMLTextAreaElement | null = document.querySelector('#textarea--multi');
      if (tarea !== null) {
        // console.log(json.gcode);
        tarea.value = json.gcode.join('\n');
      } else {
        console.log('no textarea');
      }
    }
  } catch (err) {
    // console.log(err);
  }
  code.textContent = JSON.stringify(obj, null, 2);
  pre.append(code);
  target.prepend(pre);
};

const render = () => {
  try {
    const state = store.getState();
    const responses = state.responses;
    const { portIsOpen, currentPort } = state.responses[0].appState;

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
      console.error('could not find `div#connectionState`');
    }

    if (statusPort !== null) {
      statusPort.textContent = currentPort;
      if (portIsOpen === true) {
        statusPort.classList.add('is-connected');
      } else {
        statusPort.classList.remove('is-connected');
      }
    } else {
      console.error('could not find `div#connectionState`');
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
  store.dispatch(postData({ getAppState: 'foo' }, `${apiUrl}`));
  render();
  const singleForm: HTMLFormElement | null = document.querySelector('form#single');

  singleForm!.onsubmit = (_e: any) => {
    return false;
  };

  const buttonMultiline: HTMLButtonElement | null = document.querySelector('input.button--multi');
  const buttonSingle: HTMLButtonElement | null = document.querySelector('input.button--single');
  const buttonUpload: HTMLButtonElement | null = document.querySelector('input.button--upload');
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
        store.dispatch(postData({ connect: true }, `${apiUrl}/commands/connect`));
      });
    }
    if (buttonDisconnect !== null) {
      buttonDisconnect.addEventListener('click', (event) => {
        event.preventDefault();
        store.dispatch(postData({ connect: false }, `${apiUrl}/commands/disconnect`));
      });
    }
    if (buttonHomeing !== null) {
      buttonHomeing.addEventListener('click', (event) => {
        event.preventDefault();
        store.dispatch(postData({}, `${apiUrl}/commands/home`));
      });
    }
    if (buttonUnlock !== null) {
      buttonUnlock.addEventListener('click', (event) => {
        event.preventDefault();
        store.dispatch(postData({}, `${apiUrl}/commands/unlock`));
      });
    }
    if (buttonMultiline !== null) {
      buttonMultiline.addEventListener('click', (event) => {
        event.preventDefault();
        const area: HTMLTextAreaElement | null = document.querySelector('textarea.input--multi');
        if (area !== null) {
          console.log('val', area.value);
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
        const key = event.charCode || event.keyCode || 0;
        if (key === 13) {
          // inputSingle.value;
          store.dispatch(postData({ command: `${inputSingle.value}\n` }, `${apiUrl}`));
        }
      });
    }

    if (buttonSingle !== null) {
      buttonSingle.addEventListener('click', (event) => {
        event.preventDefault();
        const input: HTMLInputElement | null = document.querySelector('input.input--single');
        if (input !== null) {
          // input.value;
          store.dispatch(postData({ command: `${input.value}\n` }, `${apiUrl}`));
        }
      });
    }
    if (buttonUpload !== null) {
      buttonUpload.addEventListener('click', (event) => {
        event.preventDefault();
        const uploadForm: HTMLFormElement | null = document.querySelector('form#svgupload');
        if (uploadForm !== null) {
          const formData = new FormData(uploadForm);
          const infile: HTMLInputElement | null = document.querySelector('input#file');
          if (infile !== null && infile.files !== null) {
            console.log(infile!.files);
            if (infile.files.length > 0) {
              // formData.append('file', infile.files[0]);
              // console.log(formData);
              // Display the key/value pairs
              // for (const pair of formData.entries()) {
              //   console.log(pair[0] + ', ' + pair[1]);
              // }
              console.log(infile.files[0]);
              store.dispatch(postData({
                formData,
                setJSONHeader: false,
              }, `${apiUrl}/uploadsvg`));
            }
          }
        }
      });
    }
  } else {
    throw new Error('The target container `section.responses` does not exist');
  }
});
