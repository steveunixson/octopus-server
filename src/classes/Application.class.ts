import * as bodyParser from 'body-parser';
import express, { Express } from 'express';
import http, { Server } from 'http';
import WebSocket from 'ws';
import fileUpload from 'express-fileupload';
import JSONResponse from '../helpers/JSONResponse.class';
import log from '../helpers/WinstonLogger.class';
import WebSocketConnection from '../classes/WebSocketConnection.class';

export default class App extends WebSocketConnection {
  public readonly app: Express;

  public readonly server: Server;

  public port: number;

  public wss: WebSocket.Server;

  public constructor(port: number) {
    super();
    this.port = port;
    this.app = express();
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    }));
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
    this.app.post('/upload/image', (req, res): void => {
      try {
        // @ts-ignore
        JSONResponse.success(req, res, [{ image: req.files.image.data.toString('base64') }], 'image converted to base64');
      } catch (e) {
        JSONResponse.serverError(req, res, [{ error: e.toString() }], 'Got an error while uploading a file!');
      }
    });
  }

  public start(): void {
    try {
      this.app.listen(this.port);
      this.routes();
      log.info(`STARTED EXPRESS APP AT: ${this.port}`);
    } catch (exception) {
      log.error(`FAILED TO START THE APP WITH ${exception}`);
    }
  }
}
