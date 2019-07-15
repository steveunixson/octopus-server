import mongoose, { Schema } from 'mongoose';
import ImageInterface from '../interfaces/Image.interface';

const ImageSchema: Schema = new Schema({
  data: { type: Buffer, required: true },
  name: { type: String, required: true },
});

export default mongoose.model<ImageInterface>('Image', ImageSchema);
