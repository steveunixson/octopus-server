import * as bodyParser from 'body-parser';
import express, { Express } from 'express';
import http, { Server } from 'http';
import WebSocket from 'ws';
import JSONResponce from './helpers/JSONResponse.class';
import log from './helpers/WinstonLogger.class';

const wsSettings = {
  port: 9020,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed.
  },
};

class App {
  public app: Express;

  public port: number;

  public server: Server;

  public wss: WebSocket.Server;

  public constructor(port: number) {
    this.port = port;
    this.app = express();
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.get('/', (req, res): void => {
      JSONResponce.success(req, res, [], 'hello world!');
    });
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server(wsSettings);
  }

  public async start(): Promise<void> {
    await this.app.listen(this.port);
    this.wss.on('connection', (ws: WebSocket): void => {
      ws.on('message', (message: string): void => {
        log.info(`received: ${message}`);
        ws.send(`Hello, you sent -> ${message}`);
      });
      ws.send('Hi there, I am an Octopus WebSocket server');
    });
  }
}


const app = new App(3001);
app
  .start()
  .then((): void => {
    log.info(`STARTED EXPRESS APP AT: ${app.port}`);
  })
  .catch((exception): void => {
    log.error(`FAILED TO START THE APP WITH ${exception.toString()}`);
  });

/* export default app.app; */
