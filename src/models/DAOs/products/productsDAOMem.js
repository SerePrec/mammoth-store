import BaseDAOMem from "../../baseDAOs/baseDAOMem.js";
import { ProductDTO } from "../../DTOs/productDTO.js";

class ProductsDAOMem extends BaseDAOMem {
  static #instance;

  constructor() {
    if (ProductsDAOMem.#instance) {
      return ProductsDAOMem.#instance;
    }
    super(ProductDTO);
    ProductsDAOMem.#instance = this;
  }
}

export default ProductsDAOMem;
