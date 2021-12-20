import ContenedorFS from "../../containers/ContenedorFS.js";
import config from "../../../config.js";

class CartsDaoFS extends ContenedorFS {
  constructor() {
    super(config.fileSystemDb.cartsFile);
  }

  async save(cart = { products: [] }) {
    return super.save(cart);
  }
}

export default CartsDaoFS;
