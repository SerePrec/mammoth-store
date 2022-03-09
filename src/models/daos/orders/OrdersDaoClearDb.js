import OrdersDaoSQL from "./OrdersDaoSQL.js";
import config from "../../../config.js";

class OrdersDaoClearDb extends OrdersDaoSQL {
  constructor() {
    super(config.clearDb);
  }
}

export default OrdersDaoClearDb;
