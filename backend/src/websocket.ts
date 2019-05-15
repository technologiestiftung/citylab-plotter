import { EventEmitter } from 'events';
import http from 'http';
import WebSocket, { OPEN } from 'ws';

const broadcast = (wss: WebSocket.Server, data: string|object) => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === OPEN) {
      client.send(data);
    } else {
      process.stderr.write(`client ${client} not ready\n`);
    }
  });
};

// export default function(server: http.Server): WebSocket.Server {
//   const wss = new WebSocket.Server({server});
//   wss.on('connection', (client: WebSocket) => {
//     client.on('error', (error: Error) => {
//       process.stderr.write(`Error in client:\n${client}\nerror:\n${error}\n`);
//     });
//     client.on('message', (data: string|object) => {
//       broadcast(wss, data);
//     });
//   });
//   return wss;
// }

export class WS {
  public static emitter: EventEmitter = new EventEmitter();
  public static getInstance(server: http.Server) {
    if (!WS.server) {
      WS.server = new WebSocket.Server({server});
      // --------- connected -------
      WS.server.on('connection', (client: WebSocket) => {
        //  ------ error handling --------
        client.on('error', (error: Error) => {
          process.stderr.write(`Error in client:\n${client}\nerror:\n${error}\n`);
        });

        //  -------- on incoming messages --------
        client.on('message', (data: string|object) => {
          WS.emitter.emit('messages', data);
          broadcast(WS.server, data);
        });

        //  -----------------------
        WS.emitter.on('send', (message) => {
          broadcast(WS.server, message);
        });
      });
    }
    return WS.server;
  }
  private static server: WebSocket.Server;
  private constructor(public readonly name?: string) {
    // super();
  }
}
