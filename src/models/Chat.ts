import mongoose, { Schema, Document } from "mongoose";

// Interface untuk Content
interface IContent extends Document {
  message: string;
  type: string;
  slug: string;
  title?: string;
  image?: string;
  brand_name?: string;
  service_uuid?: string;
  offer_uuid?: string;
  uuid?: string;
  number?: string;
  created_at: Date;
  user_id: string;
  status: string;
}

// Interface untuk Contact
interface IContact extends Document {
  user_id: string;
  type: string;
  name?: string;
  email?: string;
  avatar?: string;
  company_uuid?: string;
  company_name?: string;
  brand_name?: string;
  brand_uuid?: string;
}

// Interface untuk Chat
interface IChat extends Document {
  type: string;
  content: IContent[];
  contacts: IContact[];
}

// Schema untuk Content
const contentSchema: Schema<IContent> = new Schema({
  message: { type: String, required: true },
  type: { type: String, required: true },
  slug: { type: String, required: true },
  title: { type: String },
  image: { type: String },
  brand_name: { type: String },
  service_uuid: { type: String },
  offer_uuid: { type: String },
  uuid: { type: String },
  number: { type: String },
  created_at: { type: Date, required: true },
  user_id: { type: String, required: true },
  status: { type: String, required: true },
});

// Schema untuk Contact
const contactSchema: Schema<IContact> = new Schema({
  user_id: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  avatar: { type: String },
  company_uuid: { type: String },
  company_name: { type: String },
  brand_name: { type: String },
  brand_uuid: { type: String },
});

// Schema untuk Chat
const chatSchema: Schema<IChat> = new Schema({
  type: { type: String, required: true },
  content: { type: [contentSchema], default: [] },
  contacts: { type: [contactSchema], default: [] },
});

export default mongoose.model<IChat>("Chat", chatSchema);
