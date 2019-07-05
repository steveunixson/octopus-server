import express from 'express';
import { FileArray } from 'express-fileupload';
import JSONResponse from '../helpers/JSONResponse.class';

export default class FileUploadController {
  public uploadFile = (req: express.Request, res: express.Response): void => {
    try {
      // @ts-ignore
      // TODO create interface for req.image.data object
      // TypeScript type annotation for res.body
      // https://stackoverflow.com/questions/48027563/typescript-type-annotation-for-res-body
      const image: FileArray = req.files.image.data.toString('base64');
      JSONResponse.success(req, res, [{ image }], 'image converted to base64');
    } catch (e) {
      JSONResponse.serverError(req, res, [{ error: e.toString() }], 'Got an error while uploading a file!');
    }
  }
}
