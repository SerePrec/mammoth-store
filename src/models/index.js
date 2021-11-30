import ContenedorFS from "./ContenedorFS.js";
const productosModel = new ContenedorFS("productos.json");
const messagesModel = new ContenedorFS("mensajes.json");
export { productosModel, messagesModel };
