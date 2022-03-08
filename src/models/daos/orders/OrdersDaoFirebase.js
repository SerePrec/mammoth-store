import ContenedorFirebase from "../../containers/ContenedorFirebase.js";

class OrdersDaoFirebase extends ContenedorFirebase {
  constructor() {
    super("orders");
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

  //Obtengo el número de ódenes
  async getCount() {
    try {
      const snapshot = await this.collection.get();
      const ordersQty = snapshot.size;
      return ordersQty;
    } catch (error) {
      throw new Error(`Error al obtener el conteo de órdenes: ${error}`);
    }
  }

  //Obtengo todas las órdenes por username
  async getByUsername(username) {
    try {
      const snapshot = await this.collection
        .where("username", "==", username)
        .orderBy("timestamp", "desc")
        .get();

      let orders = [];
      snapshot.forEach(doc =>
        orders.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })
      );
      return orders;
    } catch (error) {
      throw new Error(
        `Error al obtener las órdenes con username:'${username}': ${error}`
      );
    }
  }
}

export default OrdersDaoFirebase;
