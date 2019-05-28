// import { IResponse } from './common/interfaces';
import {svgcode} from '@tsb/svgcode';
import Router from 'express-promise-router';
import { IAppState } from './common/interfaces';
const router = Router();
import Readline from '@serialport/parser-readline';
import SerialPort from 'serialport';

import fs from 'fs';
import multer from 'multer';
import util from 'util';
import { ControlCommands } from './common/enums';
import { IResponse } from './common/interfaces';
import { AsyncRoute } from './common/types';
import { WS } from './websocket';

const readFileAsync = util.promisify(fs.readFile);

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename:  (_req, file, cb) =>  {
    const nameSplit = file.originalname.split('.');
    cb(null, `${nameSplit[0]}-${Date.now()}.${nameSplit[nameSplit.length - 1]}`);
  },
});
const upload = multer({ storage });

const sPort = process.env.SERIAL_PORT || '/dev/tty.usbmodem143201';

// let currentState: IAppState = {
//   currentPort: sPort,
//   portIsOpen: false,
// };
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
  // currentState.portIsOpen = true;
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
      // currentState.portIsOpen = false;
      console.info('Port is closed');
    }
  });
});

const getCurrentState: () => Promise<IAppState> = async () => {
  try {
    const list = await SerialPort.list();
    const state: IAppState = {
      availablePorts: list,
      currentPort: sPort,
      portIsOpen: port.isOpen,
    };
    return state;
  } catch (error) {
    throw error;
  }
};

const responsePayload: (message: string | Error, success: boolean) => Promise<IResponse> = async (message, success) => {
  const currentState = await getCurrentState();
  // console.log('state in responsePayload before setting it', currentState);
  const res: IResponse = {
    appState: currentState,
    message: message instanceof Error ? message.message : message,
    success,
  };
  return res;
};

const defaultGet: AsyncRoute = async (request, response) => {
  // const list = await SerialPort.list();
  // currentState = {
  //   availablePorts: list,
  //   currentPort: sPort,
  //   portIsOpen: port.isOpen,
  // };
  response.json(await responsePayload('Appliction State', true));
};

const defaultCommandPost: AsyncRoute = async (request, response) => {
  if (request.body.hasOwnProperty('command') === true && typeof request.body.command === 'string') {
    if (port.isOpen === true) {
      console.log(request.body.command);

      port.write(request.body.command, async (err) => {
        if (err) {

          response.status(400).json(await responsePayload(err, true));
        } else {
          response.json(
            await responsePayload(`Executed command: ${request.body.command}`, true),
          );
        }
      });
    } else {
      response.status(400).json(await responsePayload('Not connected', false));
    }
  } else if (request.body.hasOwnProperty('getAppState') === true) {
    response.json(await responsePayload('Application state:', true));

  }
};

const controlCommander: AsyncRoute = async (request, response) => {
  console.log(request.params);
  if (port.isOpen === true) {
    let cmd: string = '';
    switch (request.params.cmd) {
      case 'home':
        cmd = ControlCommands.home;
        break;
      case 'unlock':
        cmd = ControlCommands.unlock;
        break;
      case 'disconnect':
      break;
      case 'connect':
      break;
    }
    // console.log('control command is', cmd);

    port.write(cmd, async (err) => {
      if (err) {
        response.status(400).json(await responsePayload(err, false));
      }
      response.json(await responsePayload(`Executed command: ${cmd}`, true));
    });
  }
};
// const home: AsyncRoute = async (_request, response) => {
//   // const res: IResponse = {};

//   if (port.isOpen === true) {
//     port.write(ControlCommands.home, async (err) => {
//       if (err) {
//         // res.message = err.message;
//         // res.success = false;
//         response.status(400).json(await responsePayload(err, false));
//       }
//       // res.message = `Executed Command: ${ControlCommands.home}`;
//       // res.success = true;
//       response.json(await responsePayload(`Executed command: ${ControlCommands.home}`, true));
//     });
//   }
//   // response.json({ message: 'home', success: true });
// };

// const unlock: AsyncRoute = async (_request, response) => {
//   response.json(await responsePayload('unlock not inplemented yet', true));
// };

const connect: AsyncRoute = async (request, response) => {
  console.log('call /command/connect');
  console.log(request.body);
  if (request.body.connect !== undefined && typeof request.body.connect === 'boolean') {
      if (port.isOpen === false) {
        port.open(async (err) => {
          if (err) {
            console.error(err);
            response.json(await responsePayload(err, false));
          } else {
            // currentState.portIsOpen = port.isOpen;
            response.json(await responsePayload('Connected', true));
          }
        });
      } else {
        response.json(await responsePayload('Already connected', true));
      }
  }
};

const disconnect: AsyncRoute = async (request, response) => {

  if (port.isOpen === true) {
    port.close(async (err) => {
      if (err) {
        // res.message = err.message;
        // res.success = false;
        response.status(400).json(await responsePayload(err, false));
      }
      // res.message = 'Disconnected';
      // res.success = true;
      // currentState.portIsOpen  = port.isOpen;
      console.log('Disconnected port');
      response.json(await responsePayload('Disconnected', true));

    });
  } else {
    // res.message = 'Not connected';
    // res.success = false;
    console.log('port not connected');
    response.json(await responsePayload('Not connected', true));
  }
};
const uploadSVG: AsyncRoute =  async (request, response) => {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log('file', request.file);
  const opts = {
    // depth: 9,
    // unit: 'mm',
    // map: 'xyz',
    // top: -10
  };
  const fileContent = await readFileAsync(request.file.path, 'utf8');
  const gcode = svgcode()
  // .loadFile(inFile)
  .setSvg(fileContent)
  .setOptions(opts)
  .generateGcode()
  .getGcode();
  response.json(await responsePayload(JSON.stringify({gcode}), true));
};

router.get('/', defaultGet);
router.post('/', defaultCommandPost);
router.post('/uploadsvg', upload.single('file'), uploadSVG);
router.post('/commands/connect', connect);
router.post('/commands/disconnect', disconnect);
// router.post('/commands/:cmd(home|unlock)?', controlCommander);
router.post('/commands/:cmd([a-z]+)?', controlCommander);
// router.post('/unlock', unlock);
export default router;
