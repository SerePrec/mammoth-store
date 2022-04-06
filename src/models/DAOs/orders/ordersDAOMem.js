import BaseDAOMem from "../../baseDAOs/baseDAOMem.js";

class OrdersDAOMem extends BaseDAOMem {
  save(order) {
    const number = this.getCount() + 1;
    const newOrder = { ...order, number };
    return super.save(newOrder);
  }

  //Obtengo el número de órdenes
  getCount() {
    return this.elements.length;
  }

  //Obtengo todas las órdenes por username
  getByUsername(username) {
    const orders = this.getAll();
    const userOrders = orders
      .reverse()
      .filter(order => order.username === username);
    return userOrders;
  }
}

export default OrdersDAOMem;
