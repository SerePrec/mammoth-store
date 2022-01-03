import mongoose from "mongoose";
import ContenedorMongoDB from "../../containers/ContenedorMongoDB.js";
import { productSchema } from "../products/ProductsDaoMongoDB.js";

const { Schema } = mongoose;

const cartItemSchema = new Schema({
  product: productSchema,
  quantity: { type: Number, min: 0, required: true }
});

class CartsDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super("Cart", {
      products: { type: [cartItemSchema], required: true }, //implicitly default value [] (empty array)
      timestamp: { type: Date, default: new Date() }
    });
  }
  async save(cart = { products: [] }) {
    return super.save(cart);
  }
}

export default CartsDaoMongoDB;
