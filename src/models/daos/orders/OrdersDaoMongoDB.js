import mongoose from "mongoose";
import ContenedorMongoDB from "../../containers/ContenedorMongoDB.js";
import { cartItemSchema } from "../carts/CartsDaoMongoDB.js";
import { deepClone, renameField } from "../../../utils/dataTools.js";

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

class OrdersDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super("Order", orderSchema);
  }

  async save(order) {
    try {
      const number = (await this.getCount()) + 1;
      const newOrder = { ...order, number };
      return super.save(newOrder);
    } catch (error) {
      throw new Error(`Error guardar la orden: ${error}`);
    }
  }

  //Obtengo el número de ódenes
  async getCount() {
    try {
      const ordersQty = await this.CollModel.estimatedDocumentCount();
      return ordersQty;
    } catch (error) {
      throw new Error(`Error al obtener el conteo de órdenes: ${error}`);
    }
  }

  //Obtengo todas las órdenes por username
  async getByUsername(username) {
    try {
      let userOrders = await this.CollModel.find({ username }, { __v: 0 })
        .sort({ timestamp: -1 })
        .lean();
      userOrders = deepClone(userOrders);
      userOrders.forEach(order => renameField(order, "_id", "id"));
      return userOrders;
    } catch (error) {
      throw new Error(
        `Error al obtener las órdenes con username:'${username}': ${error}`
      );
    }
  }
}

export default OrdersDaoMongoDB;
