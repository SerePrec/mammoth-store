import mongoose from "mongoose";
import ContenedorMongoDB from "../../containers/ContenedorMongoDB.js";

const { Schema } = mongoose;

const cartProductSchema = new Schema({
  id: { type: mongoose.Types.ObjectId, required: true },
  title: { type: String, required: true },
  detail: { type: String },
  brand: { type: String, uppercase: true, required: true },
  code: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true },
  thumbnail: { type: String },
  timestamp: { type: Date, default: Date.now },
  _id: false
});

const cartItemSchema = new Schema({
  product: cartProductSchema,
  quantity: { type: Number, min: 0, required: true },
  _id: false
});

class CartsDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super("Cart", {
      products: { type: [cartItemSchema], required: true }, //implicitly default value [] (empty array)
      timestamp: { type: Date, default: Date.now }
    });
  }
  async save(cart = { products: [] }) {
    return super.save(cart);
  }
}

export default CartsDaoMongoDB;
