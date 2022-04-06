import BaseDAOMongoDB from "../../baseDAOs/baseDAOMongoDB.js";
import { productSchema } from "../../schemas/productSchemaMongoDB.js";
import { ProductDTO } from "../../DTOs/productDTO.js";

class ProductsDAOMongoDB extends BaseDAOMongoDB {
  static #instance;

  constructor() {
    if (ProductsDAOMongoDB.#instance) {
      return ProductsDAOMongoDB.#instance;
    }
    super("Product", productSchema, ProductDTO);
    ProductsDAOMongoDB.#instance = this;
  }
}

export default ProductsDAOMongoDB;
