import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import { ProductDTO } from "../../DTOs/productDTO.js";
import config from "../../../config.js";

class ProductsDAOClearDb extends BaseDAOSQL {
  static #instance;

  constructor() {
    if (ProductsDAOClearDb.#instance) {
      return ProductsDAOClearDb.#instance;
    }
    super(config.clearDb, "products", ProductDTO);
    ProductsDAOClearDb.#instance = this;
  }
}

export default ProductsDAOClearDb;
