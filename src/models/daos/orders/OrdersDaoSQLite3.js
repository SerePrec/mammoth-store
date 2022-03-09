import OrdersDaoSQL from "./OrdersDaoSQL.js";
import config from "../../../config.js";

class OrdersDaoSQLite3 extends OrdersDaoSQL {
  constructor() {
    super(config.sqlite3);
  }
}

export default OrdersDaoSQLite3;
