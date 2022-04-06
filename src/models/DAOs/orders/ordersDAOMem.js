import BaseDAOMem from "../../baseDAOs/baseDAOMem.js";
import { OrderDTO } from "../../DTOs/orderDTO.js";
class OrdersDAOMem extends BaseDAOMem {
  static #instance;

  constructor() {
    if (OrdersDAOMem.#instance) {
      return OrdersDAOMem.#instance;
    }
    super(OrderDTO);
    OrdersDAOMem.#instance = this;
  }

  save(order) {
    const number = this.getCount() + 1;
    const newOrder = { ...order, number };
    return super.save(newOrder);
  }

  //Obtengo el número de órdenes
  getCount() {
    return this.elements.length;
  }

  //Obtengo todas las órdenes por username
  getByUsername(username) {
    try {
      const orders = this.getAll();
      const userOrders = orders
        .reverse()
        .filter(order => order.username === username);
      return userOrders.map(order => new this.DTO(order));
    } catch (error) {
      throw new Error(
        `Error al obtener las órdenes con username:'${username}': ${error}`
      );
    }
  }
}

export default OrdersDAOMem;
