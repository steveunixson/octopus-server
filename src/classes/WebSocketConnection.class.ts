/* eslint-disable no-underscore-dangle */
import WebSocket from 'ws';
import log from '../helpers/WinstonLogger.class';
import { clientArray, ClientsClass } from './Clients.class';
import ClientInterface from '../interfaces/Client.interface';

export default class WebSocketConnection {
  public clients: ClientsClass = clientArray;

  public ConnectionHandler(ws: ClientInterface): void {
    this.connection(ws);
  }

  public connection(ws: ClientInterface): void {
    log.info('CLIENT CONNECTED');
    this.clients.newClient(ws);
    ws.on('message', (message: string): void => {
      log.info(`received: ${message}`);
    });
    ws.on('close', (): void => {
      log.info('connection closed');
      this.clients.removeClient();
    });
  }

  public broadcast(): void {
    if (this.clients.getClientsLength() === 0) {
      throw Error('NOCLIENTS');
    }
    this.clients.getClients().forEach((client): void => {
      if (client.readyState === WebSocket.OPEN) {
        log.debug('BROADCASTED TEST MESSAGES TO ALL CONNECTED DEVICES');
        client.send('test');
      }
    });
  }
}
