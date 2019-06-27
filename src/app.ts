/* eslint-disable no-underscore-dangle */
import * as bodyParser from 'body-parser';
import express, { Express } from 'express';
import http, { Server } from 'http';
import WebSocket from 'ws';
import JSONResponce from './helpers/JSONResponse.class';
import log from './helpers/WinstonLogger.class';
import SocketStorageClass from './classes/SocketStorage.class';

class App {
  public app: Express;

  public port: number;

  public server: Server;

  public wss: WebSocket.Server;

  public socket: SocketStorageClass;

  public constructor(port: number) {
    this.port = port;
    this.app = express();
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server, port: 9020 });
    this.socket = new SocketStorageClass(new WebSocket('ws://localhost:9020'));
    this.wss.on('connection', (ws: WebSocket): void => {
      this.socket.setSocket = ws;
      ws.send('Hi there, I am an Octopus WebSocket server');
      ws.on('message', (message: string): void => {
        log.info(`received: ${message}`);
        ws.send(`Hello, you sent -> ${message}`);
      });
    });
  }

  private routes(): void {
    this.app.get('/', (req, res): void => {
      this.socket.getSocket.send('DATA');
      JSONResponce.success(req, res, [], 'hello world!');
    });
    this.app.get('/test', (req, res): void => {
      this.wss.clients.forEach((client): void => {
        if (client.readyState === WebSocket.OPEN) {
          client.send('test');
        }
      });
      JSONResponce.success(req, res, [], 'Test started!');
    });
  }

  public async start(): Promise<void> {
    this.app.listen(this.port);
    this.routes();
  }
}


const app = new App(3000);
app
  .start()
  .then((): void => {
    log.info(`STARTED EXPRESS APP AT: ${app.port}`);
  })
  .catch((exception): void => {
    log.error(`FAILED TO START THE APP WITH ${exception.toString()}`);
  });

/* export default app.app; */
