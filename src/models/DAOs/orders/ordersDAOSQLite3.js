import OrdersDAOSQL from "./ordersDAOSQL.js";
import { OrderDTO } from "../../DTOs/orderDTO.js";
import config from "../../../config.js";

class OrdersDAOSQLite3 extends OrdersDAOSQL {
  static #instance;

  constructor() {
    if (OrdersDAOSQLite3.#instance) {
      return OrdersDAOSQLite3.#instance;
    }
    super(config.sqlite3, OrderDTO);
    OrdersDAOSQLite3.#instance = this;
  }
}

export default OrdersDAOSQLite3;
