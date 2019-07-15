/* eslint-disable semi */
import { Document } from 'mongoose';

export default interface ImageInterface extends Document {
  data: Buffer;
  name: string;
}
