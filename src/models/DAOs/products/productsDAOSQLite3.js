import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import { ProductDTO } from "../../DTOs/productDTO.js";
import config from "../../../config.js";

class ProductsDAOSQLite3 extends BaseDAOSQL {
  static #instance;

  constructor() {
    if (ProductsDAOSQLite3.#instance) {
      return ProductsDAOSQLite3.#instance;
    }
    super(config.sqlite3, "products", ProductDTO);
    ProductsDAOSQLite3.#instance = this;
  }
}

export default ProductsDAOSQLite3;
