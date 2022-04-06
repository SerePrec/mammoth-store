import BaseDAOMongoDB from "../../baseDAOs/baseDAOMongoDB.js";
import { orderSchema } from "../../schemas/orderSchemaMongoDB.js";
import { OrderDTO } from "../../DTOs/orderDTO.js";

class OrdersDAOMongoDB extends BaseDAOMongoDB {
  static #instance;

  constructor() {
    if (OrdersDAOMongoDB.#instance) {
      return OrdersDAOMongoDB.#instance;
    }
    super("Order", orderSchema, OrderDTO);
    OrdersDAOMongoDB.#instance = this;
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

  //Obtengo el número de órdenes
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
      return userOrders.map(order => new this.DTO(order));
    } catch (error) {
      throw new Error(
        `Error al obtener las órdenes con username:'${username}': ${error}`
      );
    }
  }
}

export default OrdersDAOMongoDB;
