/* eslint-disable no-underscore-dangle */
import * as bodyParser from 'body-parser';
import express, { Express } from 'express';
import http, { Server } from 'http';
import WebSocket from 'ws';
import JSONResponse from './helpers/JSONResponse.class';
import log from './helpers/WinstonLogger.class';
import WebSocketConnection from './classes/WebSocketConnection.class';

class App extends WebSocketConnection {
  public readonly app: Express;

  public readonly server: Server;

  public port: number;

  public wss: WebSocket.Server;

  public constructor(port: number) {
    super();
    this.port = port;
    this.app = express();
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server, port: 9020 });
    this.wss.on('connection', super.ConnectionHandler.bind(this));
  }

  private routes(): void {
    this.app.get('/', (req, res): void => {
      JSONResponse.success(req, res, [], 'hello world!');
    });
    this.app.get('/clients', (req, res): void => {
      JSONResponse.success(req, res, [{ clients: this.clients.length }], 'clients connected');
    });
    this.app.get('/test', (req, res): void => {
      try {
        super.broadcast();
        JSONResponse.success(req, res, [{ clients: this.clients.length }], 'Test started!');
      } catch (e) {
        JSONResponse.serverError(req, res, [{ debug: e.toString() }], 'No clients connected!');
      }
    });
    this.app.get('/test/:id', (req, res): void => {
      try {
        const id = Number(req.params.id);
        this.clients[id].send('test');
        JSONResponse.success(req, res, [{ client_id: req.params.id }], 'Test started');
      } catch (e) {
        JSONResponse.serverError(req, res, [], 'No such client!');
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
