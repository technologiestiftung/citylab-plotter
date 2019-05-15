// import { IResponse } from './common/interfaces';
import Router from 'express-promise-router';
const router = Router();
import Readline from '@serialport/parser-readline';
import SerialPort from 'serialport';

import { IResponse } from './common/interfaces';
import { AsyncRoute } from './common/types';
import { WS } from './websocket';

let portIsOpen = false;
const sPort = process.env.SERIAL_PORT || '/dev/tty.usbmodem143201';
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
  portIsOpen = true;
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
  // console.log(data);
  WS.emitter.emit('send', data);

});

process.on('exit', () => {
  console.log('About to close');
  port.close((err) => {
    if (err) {
      console.error(err);
    }
  });
});

const defaultGet: AsyncRoute = async (request, response) => {
  response.json(request.body);
};

const defaultCommandPost: AsyncRoute = async (request, response) => {
  console.log(request.body);
  if (request.body.hasOwnProperty('command') === true && typeof request.body.command === 'string') {
    const res: IResponse = {};
    if (port.isOpen === true) {

      port.write(request.body.command, (err, bytesWritten) => {
        if (err) {
          res.message = err.message;
          res.success = false;
          response.status(400).json(res);
        } else {
          res.message = `bytesWritten ${bytesWritten}`;
          res.success = true;
          response.json(res);
        }
      });
    } else {
      res.message = 'not connected';
      res.success = false;
      response.status(400).json(res);
    }
  }
};
const home: AsyncRoute = async (_request, response) => {
  response.json({ message: 'home', success: true });
};

const unlock: AsyncRoute = async (_request, response) => {
  response.json({ message: 'home', success: true });
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
            response.json({ message: err.message, success: false });
          } else {
            response.json({ message: 'connected', success: true });
          }
        });
      } else {
        response.json({ message: 'already connected', success: true });
      }
    } else if (con === false) {
      if (port.isOpen === true) {
        port.close((err) => {
          if (err) {
            console.log(err);
            response.json({ message: err.message, success: false });
          } else {
            response.json({ message: 'disconnected', success: true });
          }
        });
      } else {
        response.json({ message: 'already disconnected', success: true });
      }
    }
  }
};

router.get('/', defaultGet);
router.post('/', defaultCommandPost);
router.post('/connect', connect);
router.post('/home', home);
router.post('/unlock', unlock);
export default router;
