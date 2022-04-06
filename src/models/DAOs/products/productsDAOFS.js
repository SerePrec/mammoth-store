import BaseDAOFS from "../../baseDAOs/baseDAOFS.js";
import { ProductDTO } from "../../DTOs/productDTO.js";
import config from "../../../config.js";

class ProductsDAOFS extends BaseDAOFS {
  static #instance;

  constructor() {
    if (ProductsDAOFS.#instance) {
      return ProductsDAOFS.#instance;
    }
    super(config.fileSystemDb.productsFile, ProductDTO);
    ProductsDAOFS.#instance = this;
  }
}

export default ProductsDAOFS;
