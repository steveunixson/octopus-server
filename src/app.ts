/* eslint-disable no-underscore-dangle */
import * as bodyParser from 'body-parser';
import express, { Express } from 'express';
import http, { Server } from 'http';
import WebSocket from 'ws';
import JSONResponse from './helpers/JSONResponse.class';
import log from './helpers/WinstonLogger.class';

const clients: WebSocket[] = [];

class WebSocketConnection {
  public clients: WebSocket[];

  public constructor() {
    this.clients = [];
  }

  public static ConnectionHandler(ws: WebSocket): void {
    WebSocketConnection.connection(ws);
  }

  private static connection(ws: WebSocket): void {
    log.info('CLIENT CONNECTED');
    ws.send('Hi there, I am an Octopus WebSocket server');
    ws.on('message', (message: string): void => {
      log.info(`received: ${message}`);
    });
    ws.on('close', (): void => {
      log.info('connection closed!');
      clients.pop();
    });
    clients.push(ws);
  }
}

class App {
  public readonly app: Express;

  public readonly server: Server;

  public port: number;

  public wss: WebSocket.Server;

  public constructor(port: number) {
    this.port = port;
    this.app = express();
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server, port: 9020 });
    this.wss.on('connection', WebSocketConnection.ConnectionHandler.bind(this));
  }

  private routes(): void {
    this.app.get('/', (req, res): void => {
      JSONResponse.success(req, res, [], 'hello world!');
    });
    this.app.get('/clients', (req, res): void => {
      JSONResponse.success(req, res, [{ clients: clients.length }], 'clients connected');
    });
    this.app.get('/test', (req, res): void => {
      try {
        clients[0].send('test');
        JSONResponse.success(req, res, [], 'Test started!');
      } catch (e) {
        JSONResponse.serverError(req, res, [], 'No clients connected!');
      }
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
    log.error(`FAILED TO START THE APP WITH ${exception}`);
  });

/* export default app.app; */

/* this.wss = new WebSocket.Server({ server: this.server, port: 9020 });
    this.socket = new SocketStorageClass(new WebSocket('ws://localhost:9020'));
    this.wss.on('connection', (ws: WebSocket): void => {
      this.socket.setSocket = ws;
      ws.send('Hi there, I am an Octopus WebSocket server');
      ws.on('message', (message: string): void => {
        log.info(`received: ${message}`);
        ws.send(`Hello, you sent -> ${message}`);
      });
    }); */

/* this.socket.getSocket.send('DATA'); */

/* this.wss.clients.forEach((client): void => {
        if (client.readyState === WebSocket.OPEN) {
          client.send('test');
        }
      }); */
