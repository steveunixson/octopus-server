import express from 'express';
import JSONResponse from '../helpers/JSONResponse.class';

export default class ClientsController {
  public getAllPosts = (req: express.Request, res: express.Response): void => {
    JSONResponse.success(req, res, [], 'clients connected');
  }
}
