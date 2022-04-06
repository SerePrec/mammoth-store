import BaseDAOFirebase from "../../baseDAOs/baseDAOFirebase.js";
import { ProductDTO } from "../../DTOs/productDTO.js";

class ProductsDAOFirebase extends BaseDAOFirebase {
  static #instance;

  constructor() {
    if (ProductsDAOFirebase.#instance) {
      return ProductsDAOFirebase.#instance;
    }
    super("products", ProductDTO);
    ProductsDAOFirebase.#instance = this;
  }
}

export default ProductsDAOFirebase;
