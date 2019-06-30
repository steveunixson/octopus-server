/* eslint-disable no-underscore-dangle */
import WebSocket from 'ws';
import log from '../helpers/WinstonLogger.class';

export default class WebSocketConnection {
  public clients: WebSocket[];

  public constructor() {
    this.clients = [];
  }

  public set SetClients(ws: WebSocket) {
    this.clients.push(ws);
  }

  public ConnectionHandler(ws: WebSocket): void {
    this.connection(ws);
  }

  public connection(ws: WebSocket): void {
    log.info('CLIENT CONNECTED');
    this.SetClients = ws;
    ws.on('message', (message: string): void => {
      log.info(`received: ${message}`);
    });
    ws.on('close', (): void => {
      log.info('connection closed');
      this.clients.pop();
    });
  }

  public broadcast(): void {
    if (this.clients.length === 0) {
      throw Error('NOCLIENTS');
    }
    this.clients.forEach((client): void => {
      if (client.readyState === WebSocket.OPEN) {
        log.debug('BROADCASTED TEST MESSAGES TO ALL CONNECTED DEVICES');
        client.send('test');
      }
    });
  }
}
