import express from 'express';
import ClientsController from '../controllers/Clients.controller';

export default class ClientsRouter extends ClientsController {
  public path: string = '/clients';

  public router: express.Router = express.Router();

  public constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    // add routers here
    this.router.get(this.path, this.getAllClients);
    // this.router.get(`${this.path}/:id`);
  }
}
