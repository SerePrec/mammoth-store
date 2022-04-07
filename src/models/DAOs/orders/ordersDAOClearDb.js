import OrdersDAOSQL from "./ordersDAOSQL.js";
import { OrderDTO } from "../../DTOs/orderDTO.js";
import config from "../../../config.js";

class OrdersDAOClearDb extends OrdersDAOSQL {
  static #instance;

  constructor() {
    if (OrdersDAOClearDb.#instance) {
      return OrdersDAOClearDb.#instance;
    }
    super(config.clearDb, OrderDTO);
    OrdersDAOClearDb.#instance = this;
  }
}

export default OrdersDAOClearDb;
