import mongoose, { Schema, Document } from 'mongoose';

// Interface untuk Item
interface IItem extends Document {
  name: string;
  description?: string;
  price?: number;
  createdAt?: Date;
}

// Schema untuk Item
const ItemSchema: Schema<IItem> = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IItem>('Item', ItemSchema);