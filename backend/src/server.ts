import http from 'http';
import app from './app';
import {WS} from './websocket';

const PORT = process.env.EXPRESS_PORT || 3000;
const server = http.createServer(app);
const wsserver = WS.getInstance(server);
wsserver.on('connection', () => {
  process.stdout.write(`somebody connected\n`);

});

WS.emitter.on('messages', (message) => {
  process.stdout.write(`event emitter, ${message}\n`);
});
server.listen(PORT);
server.on('listening', () => {
  process.stdout.write(`listening on http://localhost:${PORT}\n`);
});
