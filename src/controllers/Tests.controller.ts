import express from 'express';
import JSONResponse from '../helpers/JSONResponse.class';
import WebSocketConnection from '../classes/WebSocketConnection.class';
import { clientArray } from '../classes/Clients.class';

export default class TestsController extends WebSocketConnection {
  public testAll = (req: express.Request, res: express.Response): void => {
    try {
      this.broadcast();
      JSONResponse.success(req, res, [{ clients: clientArray.getClientsLength() }], 'Test started!');
    } catch (e) {
      JSONResponse.serverError(req, res, [{ debug: e.toString() }], 'No clients connected!');
    }
  };

  public testOnDeviceID = (req: express.Request, res: express.Response): void => {
    try {
      const id = Number(req.params.id);
      clientArray.getClientByID(id).send('test');
      JSONResponse.success(req, res, [{ client_id: req.params.id }], 'Test started');
    } catch (e) {
      JSONResponse.serverError(req, res, [], 'No such client!');
    }
  }
}
