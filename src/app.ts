import * as bodyParser from 'body-parser';
import express, { Express } from 'express';
import http, { Server } from 'http';
import WebSocket from 'ws';
import JSONResponce from './helpers/JSONResponse.class';
import log from './helpers/WinstonLogger.class';

class App {
  public app: Express;

  public port: number;

  public server: Server;

  public wss: WebSocket.Server;

  public constructor(port: number) {
    this.port = port;
    this.app = express();
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server, port: 9020 });
  }

  private async routes(): Promise<void> {
    await this.app.get('/', (req, res): void => {
      JSONResponce.success(req, res, [], 'hello world!');
    });
  }

  private async events(): Promise<void> {
    await this.wss.on('connection', (ws: WebSocket): void => {
      ws.on('message', (message: string): void => {
        log.info(`received: ${message}`);
        ws.send(`Hello, you sent -> ${message}`);
      });
      ws.send('Hi there, I am an Octopus WebSocket server');
      this.app.get('/test', (req, res): void => {
        ws.send('test');
        JSONResponce.success(req, res, [{ clients: this.wss.clients }], 'Test started!');
      });
    });
  }

  public async start(): Promise<void> {
    await this.app.listen(this.port);
    await this.routes();
    await this.events();
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
