import OrdersDAOSQL from "./ordersDAOSQL.js";
import config from "../../../config.js";

class OrdersDAOClearDb extends OrdersDAOSQL {
  constructor() {
    super(config.clearDb);
  }
}

export default OrdersDAOClearDb;
