// import { IResponse } from './common/interfaces';
import Router from 'express-promise-router';
import { IAppState } from './common/interfaces';
const router = Router();
import Readline from '@serialport/parser-readline';
import SerialPort from 'serialport';

import { ControlCommands } from './common/enums';
import { IResponse } from './common/interfaces';
import { AsyncRoute } from './common/types';
import { WS } from './websocket';

const sPort = process.env.SERIAL_PORT || '/dev/tty.usbmodem143201';

let currentState: IAppState = {
  currentPort: sPort,
  portIsOpen: false,
};
const port = new SerialPort(sPort, {
  autoOpen: false,
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
});
const parser = port.pipe(new Readline(/*{ delimiter: '\n' }*/));

port.on('open', () => {
  console.log('port is open');
  currentState.portIsOpen = true;
  // portIsOpen = true;
});

// Open errors will be emitted as an error event
port.on('error', (err) => {
  console.error('Error: ', err.message);
});

// Read data that is available but keep the stream in "paused mode"
// port.on('readable', () => {
//   console.log('readable Data:', port.read());
// });

// Switches the port into "flowing mode"
// port.on('data', (data) => {
//   console.log('Data:', data.toString());
// });

parser.on('data', (data: string) => {
  // console.log(typeof data);
  console.log('Message from MCU', data);
  WS.emitter.emit('send', data);
});

process.on('exit', () => {
  console.log('About to close');
  port.close((err) => {
    if (err) {
      console.error(err);
    } else {
      currentState.portIsOpen = false;
      console.info('Port is closed');
    }
  });
});

const responsePayload: (message: string|Error, success: boolean) => IResponse = (message, success) => {
  const res: IResponse = {
    appState: currentState,
    message : message instanceof Error ? message.message : message,
    success,
  };
  return res;
};

const defaultGet: AsyncRoute = async (request, response) => {
  const list = await SerialPort.list();
  currentState = {
    availablePorts: list,
    currentPort: sPort,
    portIsOpen: port.isOpen,
  };
  response.json(responsePayload('Appliction State', true));
};

const defaultCommandPost: AsyncRoute = async (request, response) => {
  console.log(request.body);
  if (request.body.hasOwnProperty('command') === true && typeof request.body.command === 'string') {
    if (port.isOpen === true) {

      port.write(request.body.command, (err) => {
        if (err) {

          response.status(400).json(responsePayload(err, true));
        } else {
          response.json(
            responsePayload(`Executed command: ${request.body.command}`, true),
            );
        }
      });
    } else {
      response.status(400).json(responsePayload('Not connected', false));
    }
  }
};
const home: AsyncRoute = async (_request, response) => {
  // const res: IResponse = {};

  if (port.isOpen === true) {
    port.write(ControlCommands.home, (err) => {
      if (err) {
        // res.message = err.message;
        // res.success = false;
        response.status(400).json(responsePayload(err, false));
      }
      // res.message = `Executed Command: ${ControlCommands.home}`;
      // res.success = true;
      response.json(responsePayload(`Executed command: ${ControlCommands.home}`, true));
    });
  }
  // response.json({ message: 'home', success: true });
};

const unlock: AsyncRoute = async (_request, response) => {
  response.json(responsePayload('unlock not inplemented yet', true));
};

const connect: AsyncRoute = async (request, response) => {
  if (request.body.connect !== undefined && typeof request.body.connect === 'boolean') {
    // const payload: IResponse = {
    //   message: '',
    //   success: false,
    // };

    const con = request.body.connect;
    if (con === true) {
      if (port.isOpen === false) {
        port.open((err) => {
          if (err) {
            console.error(err);
            response.json(responsePayload(err, false));
          } else {
            currentState.portIsOpen = port.isOpen;
            response.json(responsePayload('Connected', true));
          }
        });
      } else {
        response.json(responsePayload('Already connected', true));
      }
    } else if (con === false) {
      if (port.isOpen === true) {
        port.close((err) => {
          if (err) {
            console.log(err);
            response.json(responsePayload(err, false));
          } else {
            response.json(responsePayload('Disconnected', true));
          }
        });
      } else {
        response.json(responsePayload('already disconnected', true));
      }
    }
  }
};

const disconnect: AsyncRoute = async (request, response) => {
  // const res: IResponse = {};
  if (port.isOpen === true) {
    port.close((err) => {
      if (err) {
        // res.message = err.message;
        // res.success = false;
        response.status(400).json(responsePayload(err, false));
      }
      // res.message = 'Disconnected';
      // res.success = true;
      response.json(responsePayload('Disconnected', true));
    });
  } else {
    // res.message = 'Not connected';
    // res.success = false;
    response.json(responsePayload('Not connected', true));
  }
};

router.get('/', defaultGet);
router.post('/', defaultCommandPost);
router.post('/connect', connect);
router.post('/disconnect', disconnect);
router.post('/home', home);
router.post('/unlock', unlock);
export default router;
