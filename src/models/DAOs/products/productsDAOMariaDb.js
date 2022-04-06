import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import config from "../../../config.js";

class ProductsDAOMariaDb extends BaseDAOSQL {
  constructor() {
    super(config.mariaDb, "products");
  }
}

export default ProductsDAOMariaDb;
