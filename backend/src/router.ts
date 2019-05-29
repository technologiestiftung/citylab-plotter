
// import { IResponse } from './common/interfaces';
const router = Router();
import { AsyncRoute } from './common/types';
import { CommandBuffer } from './CommandBuffer';
import { ControlCommands, PlotterStates } from './common/enums';
import { defaultGet } from './route-handlers/default-get';
import { IAppState } from './common/interfaces';
import { responsePayload } from './route-handlers/response-payload';
import { uploadSVG } from './route-handlers/upload-svg';
import { WS } from './websocket';
// import fs from 'fs';
import multer from 'multer';
import Readline from '@serialport/parser-readline';
import Router from 'express-promise-router';
import SerialPort from 'serialport';
// import util from 'util';

// const readFileAsync = util.promisify(fs.readFile);
const commandBuffer = new CommandBuffer();
let gotMCUFinished = false;
let gotMCUStateIdle = false;

commandBuffer.on('command', (cmd) => {
  // console.log(`Hello`);
  // console.log(commandBuffer.commands[0]);
  let currentCommand: string = '';
  if (cmd === undefined) {
    currentCommand = commandBuffer.commands[0];
  } else {
    currentCommand = cmd;
  }
  if (currentCommand === undefined) {
    WS.emitter.emit('send', { plotterState: PlotterStates.ready });
    return;
  }
  if (currentCommand.endsWith('\n') === false) {
    currentCommand = `${currentCommand}\n`;
  }
  port.write(currentCommand, (error, bytes) => {
    if (error) {
      console.error(error);
    } else {
      commandBuffer.unshiftCommand();
      console.info(bytes);
    }
  });
});
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
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

});

// Open errors will be emitted as an error event
port.on('error', (err) => {
  console.error('Error: ', err.message);
});

parser.on('data', (data: string) => {
  // console.log(typeof data);
  console.log('Message from MCU:');
  console.log(data);
  if (data.trim() === ': finished : 0') {
    console.log('Got: finished : 0');
    gotMCUFinished = true;
  }
  if (data.trim() === ': state = Idle') {
    gotMCUStateIdle = true;
    console.log('Got : state = Idle');
  }
  if (gotMCUStateIdle === true && gotMCUFinished === true) {
    console.log('ready for next command');
    gotMCUStateIdle = !gotMCUStateIdle;
    gotMCUFinished = !gotMCUFinished;
    // commandBuffer.emitHello('buddy');
    commandBuffer.emitCommand();
  }
  // WS.emitter.emit('send', data);
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

export const getCurrentState: () => Promise<IAppState> = async () => {
  try {
    const list = await SerialPort.list();
    const state: IAppState = {
      availablePorts: list,
      currentPort: sPort,
      plotterState: commandBuffer.state,
      portIsOpen: port.isOpen,
    };
    return state;
  } catch (error) {
    throw error;
  }
};

const defaultCommandPost: AsyncRoute = async (request, response) => {
  if (request.body.hasOwnProperty('command') === true && typeof request.body.command === 'string') {
    if (port.isOpen === true) {
      console.log(request.body.command);
      commandBuffer.emitCommand();
      WS.emitter.emit('send', { plotterState: PlotterStates.busy });
      response.json(
        await responsePayload(`Executing commands: ${request.body.command}`, true),
      );
    } else {
      response.status(400).json(await responsePayload('Not connected', false));
    }
  } else if (request.body.hasOwnProperty('getAppState') === true) {
    response.json(await responsePayload('Application state:', true));

  } else {
    response.json(await responsePayload('huh?', true));

  }
};

const controlCommander: AsyncRoute = async (request, response) => {
  // console.log(request.params);
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
    commandBuffer.emitCommand(cmd);
    response.json(await responsePayload(`Executed command: ${cmd}`, true));
    // port.write(cmd, async (err) => {
    //   if (err) {
    //     response.status(400).json(await responsePayload(err, false));
    //   }
    // });
  }
};

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

router.get('/', defaultGet);
router.post('/', defaultCommandPost);
router.post('/uploadsvg', upload.single('file'), uploadSVG);
router.post('/commands/connect', connect);
router.post('/commands/disconnect', disconnect);
// router.post('/commands/:cmd(home|unlock)?', controlCommander);
router.post('/commands/:cmd([a-z]+)?', controlCommander);
// router.post('/unlock', unlock);
export default router;
