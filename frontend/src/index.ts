import 'babel-polyfill'; // needed for ie11 should be the first things
import 'whatwg-fetch'; // needed for ie11 should be the first things
// import superagent from 'superagent';
const apiUrl = `http://localhost:${process.env.API_PORT}`;
import { store } from './store/store';
import { postData } from './store/actions';


const ws: WebSocket = new WebSocket(`ws://localhost:${process.env.API_PORT}`);

// let target: HTMLElement | null = null;
interface IObject {
  [key: string]: any;
}

const responseRender: (obj: IObject, target: HTMLElement) => void = (obj, target) => {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = JSON.stringify(obj, null, 2);
  pre.append(code);
  target.prepend(pre);
}

// const postCommands = async (ele: HTMLTextAreaElement | HTMLInputElement, targetElement: HTMLElement, suffix?: string) => {
//   try {
//     const commands = suffix === undefined ? ele.value : `${ele.value}${suffix}`;
//     const res = await superagent.post(apiUrl).send({ command: commands });
//     responseRender(res.body, targetElement);
//   } catch (error) {
//     console.log(error);
//     responseRender(error.response.body, targetElement);

//   }
// }

// const post = async (path: string, data: IObject, targetElement: HTMLElement) => {
//   try {
//     const res = await superagent.post(`${apiUrl}/${path}`).send(data);
//     responseRender(res.body, targetElement);
//   } catch (error) {
//     console.log(error);
//     responseRender(error.response.body, targetElement);


//   }
// }

const render = () => {
  try {
    const state = store.getState();
    const responses = state.responses;
    let { portIsOpen, currentPort } = state.responses[0].appState;
    // if(responses.length > 0){
    //   portIsOpen = responses[0].appState.portIsOpen;
    //   currentPort = responses[0].appState.currentPort;
    // }
    // console.log('State in render', state);
    const statusConnected: HTMLElement | null = document.querySelector('#connectionState');
    const statusPort: HTMLElement | null = document.querySelector('#currentPortInfos');
    const responseTarget: HTMLElement | null = document.querySelector('section.responses');

    if (statusConnected !== null) {
      if (portIsOpen === true) {
        statusConnected.textContent = 'Connected';
        statusConnected.classList.add('is-connected');
        // console.log('textContent', statusConnected.textContent)
      } else {
        statusConnected.textContent = 'Not Connected';
        statusConnected.classList.remove('is-connected');
        // console.log('textContent', statusConnected.textContent)

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
        const res = Object.assign({},responses[0]);
        delete res.appState;

        // const pre = document.createElement('pre');
        // const code = document.createElement('code');
        // code.textContent = JSON.stringify(res, null, 2);
        // pre.append(code);
        // responseTarget.prepend(pre);
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
  store.dispatch(postData({getAppState: 'foo'}, `${apiUrl}`))
  render();
  const singleForm: HTMLFormElement | null = document.querySelector('form#single');

  singleForm!.onsubmit = function (_e: any) {
    return false;
  }

  // target = document.querySelector('section.responses');

  const buttonMultiline: HTMLButtonElement | null = document.querySelector('input.button--multi');


  const buttonSingle: HTMLButtonElement | null = document.querySelector('input.button--single');

  const inputSingle: HTMLInputElement | null = document.querySelector('input.input--single');

  const buttonConnect: HTMLButtonElement | null = document.querySelector('button#connect');
  const buttonDisconnect: HTMLButtonElement | null = document.querySelector('button#disconnect');

  const responseTarget: HTMLElement | null = document.querySelector('section.responses');


  if (responseTarget !== null) {
    ws.onmessage = (message) => {
      // tslint:disable-next-line:no-console
      // console.log(message);
      // const target = document.querySelector('.message-foo');
      // if ( target !== null) {
      //    target.innerHTML = message.data;
      // }
      responseRender({ message: message.data, type: 'socket' }, responseTarget!);
    };

    if (buttonConnect !== null) {

      buttonConnect.addEventListener('click', (event) => {
        event.preventDefault();
        // console.log('clicked connect');
        // store.dispatch(triggerConnect());
        // const isPortOpen = store.getState().apiState.appState;
        store.dispatch(postData({ connect: true }, `${apiUrl}/connect`))
        // post('connect', { connect: true }, target!);
      });
    }
    if (buttonDisconnect !== null) {
      buttonDisconnect.addEventListener('click', (event) => {
        event.preventDefault();
        // store.dispatch(triggerConnect());
        // const isPortOpen = store.getState().apiState.appState;
        store.dispatch(postData({ connect: false }, `${apiUrl}/disconnect`))
        // post('connect', { connect: true }, target!);
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
        store.dispatch(postData({command: commands}, `${apiUrl}`))
          // postCommands(area, responseTarget!);
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
        store.dispatch(postData({command: `${inputSingle.value}\n`}, `${apiUrl}`))

          // postCommands(inputSingle, responseTarget!, '\n');
        }
      });
    }

    if (buttonSingle !== null) {
      buttonSingle.addEventListener('click', (event) => {
        event.preventDefault();
        const input: HTMLInputElement | null = document.querySelector('input.input--single');
        if (input !== null) {
          input.value;
        store.dispatch(postData({command: `${input.value}\n`}, `${apiUrl}`))

          // postCommands(input, responseTarget!, '\n');
        }
      });
    }
  } else {
    throw new Error('The target container `section.responses` does not exist');
  }
});