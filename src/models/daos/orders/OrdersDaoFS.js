import ContenedorFS from "../../containers/ContenedorFS.js";
import config from "../../../config.js";

class OrdersDaoFS extends ContenedorFS {
  constructor() {
    super(config.fileSystemDb.cartsFile);
  }

  //Obtengo todas las órdenes por username
  async getByUsername(username) {
    try {
      const orders = await this.getAll();
      const userOrders = orders.filter(order => order.username === username);
      return userOrders;
    } catch (error) {
      throw new Error(
        `Error al obtener las órdenes con username:'${username}': ${error}`
      );
    }
  }
}

export default OrdersDaoFS;
