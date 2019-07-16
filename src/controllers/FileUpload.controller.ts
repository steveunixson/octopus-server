import express from 'express';
import { UploadedFile } from 'express-fileupload';
import JSONResponse from '../helpers/JSONResponse.class';
import ImageSchema from '../models/Images.model';

export default class FileUploadController {
  public uploadImage = (req: express.Request, res: express.Response): void => {
    if (req.files && req.files.image) {
      const picture = req.files.image as UploadedFile;
      // used type casting here!
      const image = new ImageSchema({
        data: picture.data,
        name: picture.name,
      });
      image.save()
        .then((): void => {
          JSONResponse.success(req, res, [], 'image was saved!');
        })
        .catch((e): void => {
          JSONResponse.serverError(req, res, [{ error: e.toString() }], 'Got an error while saving a file!');
        });
    }
    JSONResponse.serverError(req, res, [{ error: 'NOFILE' }], 'You have to upload a file!');
  };

  public getImage = (req: express.Request, res: express.Response): void => {
    ImageSchema.findOne({ name: req.params.name })
      .then((doc): void => {
        JSONResponse.success(req, res, [{ doc }], 'got image');
      })
      .catch((e): void => {
        JSONResponse.serverError(req, res, [{ error: e.toString() }], 'Got an error while getting a file!');
      });
  };
}
