import BaseDAOSQL from "../../BaseDAOs/BaseDAOSQL.js";
import config from "../../../config.js";

class ProductsDAOSQLite3 extends BaseDAOSQL {
  constructor() {
    super(config.sqlite3, "products");
  }
}

export default ProductsDAOSQLite3;
