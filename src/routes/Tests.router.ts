import express from 'express';
import TestsController from '../controllers/Tests.controller';

export default class TestsRouter extends TestsController {
  public path: string = '/test';

  public router: express.Router = express.Router();

  public constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    // add routers here
    this.router.get(this.path, this.testAll);
    this.router.get(`${this.path}/:id`, this.testOnDeviceID);
  }
}
