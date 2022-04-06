import BaseDAOFirebase from "../../baseDAOs/baseDAOFirebase.js";
import { OrderDTO } from "../../DTOs/orderDTO.js";

class OrdersDAOFirebase extends BaseDAOFirebase {
  static #instance;

  constructor() {
    if (OrdersDAOFirebase.#instance) {
      return OrdersDAOFirebase.#instance;
    }
    super("orders", OrderDTO);
    OrdersDAOFirebase.#instance = this;
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
      const snapshot = await this.collection.get();
      const ordersQty = snapshot.size;
      return ordersQty;
    } catch (error) {
      throw new Error(`Error al obtener el conteo de órdenes: ${error}`);
    }
  }

  //Obtengo todas las órdenes por username
  async getByUsername(username) {
    try {
      const snapshot = await this.collection
        .where("username", "==", username)
        .orderBy("timestamp", "desc")
        .get();

      let orders = [];
      snapshot.forEach(doc =>
        orders.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })
      );
      return orders.map(order => new this.DTO(order));
    } catch (error) {
      throw new Error(
        `Error al obtener las órdenes con username:'${username}': ${error}`
      );
    }
  }
}

export default OrdersDAOFirebase;
