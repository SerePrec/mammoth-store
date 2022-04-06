import OrdersDAOSQL from "./ordersDAOSQL.js";
import config from "../../../config.js";

class OrdersDAOMariaDb extends OrdersDAOSQL {
  constructor() {
    super(config.mariaDb);
  }
}

export default OrdersDAOMariaDb;
