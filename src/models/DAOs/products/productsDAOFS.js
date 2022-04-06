import BaseDAOFS from "../../baseDAOs/baseDAOFS.js";
import config from "../../../config.js";

class ProductsDAOFS extends BaseDAOFS {
  constructor() {
    super(config.fileSystemDb.productsFile);
  }
}

export default ProductsDAOFS;
