import 'babel-polyfill'; // needed for ie11 should be the first things
import 'whatwg-fetch'; // needed for ie11 should be the first things
import superagent from 'superagent';
const apiUrl = 'http://localhost:3000';
import {store} from './store/store';
import { triggerConnect, getData } from './store/actions';


const ws: WebSocket = new WebSocket(`ws://localhost:3000`);

let target: HTMLElement | null = null;
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

const postCommands = async (ele: HTMLTextAreaElement | HTMLInputElement, targetElement: HTMLElement, suffix?: string) => {
  try {
    const commands =  suffix === undefined ? ele.value : `${ele.value}${suffix}`;
    const res = await superagent.post(apiUrl).send({ command: commands });
    responseRender(res.body, targetElement);
  } catch (error) {
    console.log(error);
    responseRender(error.response.body, targetElement);

  }
}

const post = async (path: string, data: IObject, targetElement: HTMLElement) => {
  try {
    const res = await superagent.post(`${apiUrl}/${path}`).send(data);
    responseRender(res.body, targetElement);
  } catch (error) {
    console.log(error);
    responseRender(error.response.body, targetElement);


  }
}

document.addEventListener('DOMContentLoaded', () => {
  store.dispatch(getData());
  const singleForm: HTMLFormElement | null = document.querySelector('form#single');

  singleForm!.onsubmit = function (_e: any) {
    return false;
  }

  target = document.querySelector('section.responses');
  const buttonMultiline: HTMLButtonElement | null = document.querySelector('input.button--multi');


  const buttonSingle: HTMLButtonElement | null = document.querySelector('input.button--single');

  const inputSingle: HTMLInputElement | null = document.querySelector('input.input--single');

  const buttonConnect: HTMLButtonElement | null = document.querySelector('button#connect');


  if (target !== null) {
    ws.onmessage = (message) => {
      // tslint:disable-next-line:no-console
      // console.log(message);
      // const target = document.querySelector('.message-foo');
      // if ( target !== null) {
      //    target.innerHTML = message.data;
      // }
      responseRender({message:message.data, type:'socket'}, target!);
   };
    if (buttonConnect !== null) {
      buttonConnect.addEventListener('click', (event) => {
        event.preventDefault();
        store.dispatch(triggerConnect());
        post('connect', { connect: true }, target!);
      });
    }
    if (buttonMultiline !== null) {
      buttonMultiline.addEventListener('click', (event) => {
        event.preventDefault();
        const area: HTMLTextAreaElement | null = document.querySelector('textarea.input--multi');
        if (area !== null) {
          area.value = area.value.replace(/\n\s*\n/g, '\n');
          area.value = area.value.replace(/^\s+/g, '');
          if(area.value.endsWith('\n') === false){
            area.value = `${area.value}\n`;
          }
          postCommands(area, target!);
        } else {
          console.log('could not find textarea');
        }
      });
    }

    if (inputSingle !== null) {
      inputSingle.addEventListener('keypress', (event) => {
        var key = event.charCode || event.keyCode || 0;
        if (key == 13) {
          inputSingle.value;
          postCommands(inputSingle, target!, '\n');
        }
      });
    }

    if (buttonSingle !== null) {
      buttonSingle.addEventListener('click', (event) => {
        event.preventDefault();
        const input: HTMLInputElement | null = document.querySelector('input.input--single');
        if (input !== null) {
          input.value;
          postCommands(input, target!, '\n');
        }
      });
    }
  } else {
    throw new Error('The target container `section.responses` does not exist');
  }
});