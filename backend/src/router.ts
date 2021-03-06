
// import { IResponse } from './common/interfaces';
// import fs from 'fs';
import Readline from '@serialport/parser-readline';
import Router from 'express-promise-router';
import multer from 'multer';
import SerialPort from 'serialport';
import { CommandBuffer } from './CommandBuffer';
import { ControlCommands, PlotterStates } from './common/enums';
import { IAppState } from './common/interfaces';
import { AsyncRoute } from './common/types';
import { defaultGet } from './route-handlers/default-get';
import { responsePayload } from './route-handlers/response-payload';
import { uploadSVG } from './route-handlers/upload-svg';
import { WS } from './websocket';
import chalk from 'chalk';
//import utf7 from 'utf7';
import legacy from 'legacy-encoding';


const router = Router();

// const readFileAsync = util.promisify(fs.readFile);
const commandBuffer = new CommandBuffer();
let gotMCUFinished = false;
let gotMCUStateIdle = false;

commandBuffer.on('command', (cmd) => {
  console.log(`Executing commands`);
  console.log(commandBuffer.commands[0]);
  let currentCommand: string = '';
  if (cmd === undefined) {
    currentCommand = commandBuffer.commands[0];
  } else {
    currentCommand = cmd;
  }
  if (currentCommand === undefined) {
    WS.emitter.emit('send', [{ plotterState: PlotterStates.ready }]);
    return;
  }
  if (currentCommand.endsWith('\n') === false) {
    currentCommand = `${currentCommand}\n`;
  }
  console.log('Writing to port:');
  // console.log(chalk.bgRed(utf7.encode(currentCommand)));
  port.write(Buffer.from(currentCommand), (error, bytes) => {
    if (error) {
      console.error(error);
    } else {
      setTimeout(()=>{
        
      },300);
      commandBuffer.unshiftCommand();
      // console.info(bytes);
      setTimeout(()=>{},100);
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

let sPort = process.env.SERIAL_PORT || '/dev/tty.usbmodem143201';

// let currentState: IAppState = {
//   currentPort: sPort,
//   portIsOpen: false,
// };
const portOpts: SerialPort.OpenOptions = {
  autoOpen: false,
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
};
let port = new SerialPort(sPort, portOpts);

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
  console.log(chalk.yellow('Message from MCU:'), chalk.inverse(data));
  // console.log(data);
  if (data.trim() === ': finished : 0') {
    console.log(chalk.bgGreen(chalk.bold('FOUND: finished : 0 ')));
    gotMCUFinished = true;
  }
  if (data.trim() === ': state = Idle') {
    gotMCUStateIdle = true;
    console.log(chalk.bgGreen(chalk.bold('FOUND : state = Idle ')));
  }
  if (gotMCUStateIdle === true && gotMCUFinished === true) {
    console.log('ready for next command');
    gotMCUStateIdle = !gotMCUStateIdle;
    gotMCUFinished = !gotMCUFinished;
    // commandBuffer.emitHello('buddy');
    setTimeout(()=>{
      commandBuffer.emitCommand();

    },500);
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
  console.log(request.body);
  if (request.body.hasOwnProperty('commands') === true) {
    if (port.isOpen === true) {
      console.log('Commands from client:', request.body.commands);
      if (Array.isArray(request.body.commands) === true) {
        commandBuffer.commands = [...request.body.commands];
      }
      commandBuffer.emitCommand();
      WS.emitter.emit('send', [{ plotterState: PlotterStates.busy }]);
      response.json(
        await responsePayload(`Executing commands: ${request.body.commands}`, true),
      );
    } else {
      console.log('You are not connected');
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
        commandBuffer.emitCommand(cmd);
        break;
      case 'unlock':
        cmd = ControlCommands.unlock;
        commandBuffer.emitCommand(cmd);
        break;
      case 'zeroall':
        commandBuffer.commands = [ControlCommands.zerox0, ControlCommands.zeroy0, 'z3\n', ControlCommands.zeroz3];
        commandBuffer.emitCommand();
        WS.emitter.emit('send', [{ plotterState: PlotterStates.busy }]);
        break;
      case 'disconnect':
        break;
      case 'connect':
        console.log('connecter');
        break;
    }
    // console.log('control command is', cmd);
    // commandBuffer.emitCommand(cmd);
    response.json(await responsePayload(`Executed command: ${cmd}`, true));
    // port.write(cmd, async (err) => {
    //   if (err) {
    //     response.status(400).json(await responsePayload(err, false));
    //   }
    // });
  }
};

const connect: AsyncRoute = async (request, response) => {
  console.log('call /commands/connect');
  // console.log(request.body);
  if (request.body.portPath !== undefined && typeof request.body.portPath === 'string') {
    sPort = request.body.portPath;
    port = new SerialPort(sPort, portOpts);
  }
  if (port.isOpen === false) {
    port.open(async (err) => {
      if (err) {
        console.error(err);
        response.json(await responsePayload(err, false));
      } else {
        // currentState.portIsOpen = port.isOpen;
        commandBuffer.state = PlotterStates.ready;
        response.json(await responsePayload('Connected', true));
      }
    });
  } else {
    response.json(await responsePayload('Already connected', true));
  }
};

const disconnect: AsyncRoute = async (_request, response) => {

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
      commandBuffer.state = PlotterStates.ready;
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
