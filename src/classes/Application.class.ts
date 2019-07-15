import * as bodyParser from 'body-parser';
import express, { Express } from 'express';
import morgan from 'morgan';
import methodOverride from 'method-override';
import http, { Server } from 'http';
import WebSocket from 'ws';
import fileUpload from 'express-fileupload';
import log from '../helpers/WinstonLogger.class';
import MongooseConnection from '../classes/MongoDBConnection.class';
import WebSocketConnection from '../classes/WebSocketConnection.class';
import ClientsRouter from '../routes/Clients.router';
import FileUploadRouter from '../routes/FileUpload.router';
import IndexRouter from '../routes/Index.router';
import TestsRouter from '../routes/Tests.router';

export default class App extends WebSocketConnection {
  public readonly app: Express;

  public readonly server: Server;

  public port: number;

  public wss: WebSocket.Server;

  public mongo: MongooseConnection;

  public constructor(port: number) {
    super();
    this.port = port;
    this.app = express();
    this.app.use(methodOverride());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    }));
    this.app.use(morgan('dev'));
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server, port: 9020 });
    this.wss.on('connection', this.ConnectionHandler.bind(this));
    this.app.use(new ClientsRouter().router);
    this.app.use(new FileUploadRouter().router);
    this.app.use(new IndexRouter().router);
    this.app.use(new TestsRouter().router);
    this.mongo = new MongooseConnection('mongodb://localhost:32769/octopus', {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: 1000000,
      reconnectInterval: 1000,
    });
  }

  public start(): void {
    try {
      this.mongo.connect().then((): void => {
        this.app.listen(this.port);
      });
      log.info(`STARTED EXPRESS APP AT: ${this.port}`);
    } catch (exception) {
      log.error(`FAILED TO START THE APP WITH ${exception}`);
    }
  }
}
