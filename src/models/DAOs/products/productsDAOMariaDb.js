import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import { ProductDTO } from "../../DTOs/productDTO.js";
import config from "../../../config.js";

class ProductsDAOMariaDb extends BaseDAOSQL {
  static #instance;

  constructor() {
    if (ProductsDAOMariaDb.#instance) {
      return ProductsDAOMariaDb.#instance;
    }
    super(config.mariaDb, "products", ProductDTO);
    ProductsDAOMariaDb.#instance = this;
  }
}

export default ProductsDAOMariaDb;
