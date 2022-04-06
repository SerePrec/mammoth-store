import mongoose from "mongoose";
import { cartItemSchema } from "./cartSchemaMongoDB.js";
const { Schema } = mongoose;

const orderSchema = new Schema({
  number: { type: Number, required: true, min: 0, unique: true },
  username: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  cp: { type: String, required: true },
  phone: { type: String, required: true },
  products: { type: [cartItemSchema], required: true }, //implicitly default value [] (empty array)
  total: { type: Number, required: true, min: 0 },
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export { orderSchema };
