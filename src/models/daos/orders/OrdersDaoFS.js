import ContenedorFS from "../../containers/ContenedorFS.js";
import config from "../../../config.js";

class OrdersDaoFS extends ContenedorFS {
  constructor() {
    super(config.fileSystemDb.ordersFile);
  }

  async save(order) {
    try {
      const number = (await this.getCount()) + 1;
      const newOrder = { ...order, number };
      return super.save(newOrder);
    } catch (error) {
      throw new Error(`Error guardar la orden: ${error}`);
    }
  }

  //Obtengo el número de órdenes
  async getCount() {
    try {
      const orders = await this.getAll();
      return orders.length;
    } catch (error) {
      throw new Error(`Error al obtener el conteo de órdenes: ${error}`);
    }
  }

  //Obtengo todas las órdenes por username
  async getByUsername(username) {
    try {
      const orders = await this.getAll();
      const userOrders = orders
        .reverse()
        .filter(order => order.username === username);
      return userOrders;
    } catch (error) {
      throw new Error(
        `Error al obtener las órdenes con username:'${username}': ${error}`
      );
    }
  }
}

export default OrdersDaoFS;
