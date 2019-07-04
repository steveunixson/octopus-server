import express from 'express';

export default class ClientsRouter {
  public path: string = '/clients';

  public router: express.Router = express.Router();

  public constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    // add routers here
    this.router.get(this.path);
    this.router.get(`${this.path}/:id`);
  }
}
