import ContenedorFS from "./ContenedorFS.js";

class ProductsModelFS extends ContenedorFS {
  constructor() {
    super("productos.json");
  }
}
const productsModel = new ProductsModelFS();

class cartsModelFS extends ContenedorFS {
  constructor() {
    super("carritos.json");
  }
  async save(cart = { products: [] }) {
    return super.save(cart);
  }
}
const cartsModel = new cartsModelFS();

class MessagesModelFS extends ContenedorFS {
  constructor() {
    super("mensajes.json");
  }
}
const messagesModel = new MessagesModelFS();

export { productsModel, cartsModel, messagesModel };
