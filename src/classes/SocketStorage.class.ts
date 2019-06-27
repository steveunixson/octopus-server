/* eslint-disable no-underscore-dangle */
import WebSocket from 'ws';

export default class SocketStorageClass {
  public get getSocket(): WebSocket {
    return this.socket;
  }

  public set setSocket(socket: WebSocket) {
    this.socket = socket;
  }

  private socket: WebSocket;

  public constructor(ws: WebSocket) {
    this.socket = ws;
  }
}
