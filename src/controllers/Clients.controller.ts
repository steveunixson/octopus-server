import express from 'express';
import JSONResponse from '../helpers/JSONResponse.class';
import WebSocketConnection from '../classes/WebSocketConnection.class';

export default class ClientsController extends WebSocketConnection {
  public getAllClients = (req: express.Request, res: express.Response): void => {
    JSONResponse.success(req, res, [{ clients: this.clients.getClients().length }], 'clients connected');
  }
}
