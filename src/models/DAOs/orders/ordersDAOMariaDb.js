import OrdersDAOSQL from "./ordersDAOSQL.js";
import { OrderDTO } from "../../DTOs/orderDTO.js";
import config from "../../../config.js";

class OrdersDAOMariaDb extends OrdersDAOSQL {
  static #instance;

  constructor() {
    if (OrdersDAOMariaDb.#instance) {
      return OrdersDAOMariaDb.#instance;
    }
    super(config.mariaDb, OrderDTO);
    OrdersDAOMariaDb.#instance = this;
  }
}

export default OrdersDAOMariaDb;
