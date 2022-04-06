import OrdersDAOSQL from "./ordersDAOSQL.js";
import config from "../../../config.js";

class OrdersDAOSQLite3 extends OrdersDAOSQL {
  constructor() {
    super(config.sqlite3);
  }
}

export default OrdersDAOSQLite3;
