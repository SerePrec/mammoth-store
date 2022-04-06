import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import config from "../../../config.js";

class ProductsDAOClearDb extends BaseDAOSQL {
  constructor() {
    super(config.clearDb, "products");
  }
}

export default ProductsDAOClearDb;
