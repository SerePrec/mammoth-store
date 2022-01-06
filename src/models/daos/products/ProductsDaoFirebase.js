import ContenedorFirebase from "../../containers/ContenedorFirebase.js";

class ProductsDaoFirebase extends ContenedorFirebase {
  constructor() {
    super("products");
  }
}

export default ProductsDaoFirebase;
