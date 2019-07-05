import express from 'express';
import FileUploadController from '../controllers/FileUpload.controller';

export default class FileUploadRouter extends FileUploadController {
  public path: string = '/upload';

  public router: express.Router = express.Router();

  public constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    // add routers here
    this.router.post(`${this.path}/image`, this.uploadFile);
  }
}
