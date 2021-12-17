import ContenedorFS from "./containers/ContenedorFS.js";
import config from "../config.js";

class ProductsModelFS extends ContenedorFS {
  constructor() {
    super(config.fileSystemDb.productsFile);
  }
}
const productsModel = new ProductsModelFS();

class cartsModelFS extends ContenedorFS {
  constructor() {
    super(config.fileSystemDb.cartsFile);
  }
  async save(cart = { products: [] }) {
    return super.save(cart);
  }
}
const cartsModel = new cartsModelFS();

class MessagesModelFS extends ContenedorFS {
  constructor() {
    super(config.fileSystemDb.messagesFile);
  }
}
const messagesModel = new MessagesModelFS();

export { productsModel, cartsModel, messagesModel };
