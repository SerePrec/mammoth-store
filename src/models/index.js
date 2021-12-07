import ContenedorFS from "./ContenedorFS.js";

class ProductosModelFS extends ContenedorFS {
  constructor() {
    super("productos.json");
  }
}
const productosModel = new ProductosModelFS();

class MessagesModelFS extends ContenedorFS {
  constructor() {
    super("mensajes.json");
  }
}
const messagesModel = new MessagesModelFS();

export { productosModel, messagesModel };
