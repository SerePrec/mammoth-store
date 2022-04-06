import mongoose from "mongoose";
import BaseDAOMongoDB from "../../baseDAOs/baseDAOMongoDB.js";

const { Schema } = mongoose;

export const productSchema = new Schema({
  title: { type: String, required: true },
  detail: { type: String },
  brand: { type: String, uppercase: true, required: true },
  code: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true },
  thumbnail: { type: String },
  timestamp: { type: Date, default: Date.now }
});

class ProductsDAOMongoDB extends BaseDAOMongoDB {
  constructor() {
    super("Product", productSchema);
  }
}

export default ProductsDAOMongoDB;
