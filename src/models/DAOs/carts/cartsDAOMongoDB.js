import mongoose from "mongoose";
import BaseDAOMongoDB from "../../baseDAOs/baseDAOMongoDB.js";
import { deepClone, renameField } from "../../../utils/dataTools.js";

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

export const cartItemSchema = new Schema({
  product: cartProductSchema,
  quantity: { type: Number, min: 0, required: true },
  _id: false
});

const cartSchema = new Schema({
  username: { type: String, required: true, unique: true },
  products: { type: [cartItemSchema], required: true }, //implicitly default value [] (empty array)
  timestamp: { type: Date, default: Date.now }
});

class CartsDAOMongoDB extends BaseDAOMongoDB {
  constructor() {
    super("Cart", cartSchema);
  }
  async save(cart = { products: [] }) {
    return super.save(cart);
  }

  //Obtengo un carrito por username
  async getByUsername(username) {
    try {
      let userCart = await this.CollModel.findOne({ username }, { __v: 0 });
      return userCart ? renameField(deepClone(userCart), "_id", "id") : null;
    } catch (error) {
      throw new Error(
        `Error al obtener el carrito con username '${username}': ${error}`
      );
    }
  }
}

export default CartsDAOMongoDB;
