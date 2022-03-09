import ContenedorSQL from "../../containers/ContenedorSQL.js";
import {
  deepClone,
  removeField,
  verifyTimestamp
} from "../../../utils/dataTools.js";
import { logger } from "../../../logger/index.js";

class OrdersDaoSQL {
  constructor(config) {
    this.orders = new ContenedorSQL(config, "orders");
    this.productsInOrders = new ContenedorSQL(config, "products_in_orders");
  }

  //Obtengo el número de órdenes
  async getCount() {
    try {
      const [ordersQty] = await this.orders
        .knex("orders")
        .count("*", { as: "CNT" });
      return ordersQty.CNT;
    } catch (error) {
      throw new Error(`Error al obtener el conteo de órdenes: ${error}`);
    }
  }

  //Guardo la orden
  async save(order) {
    try {
      // El manejo del id y el timestamp se maneja internamente desde base de datos
      const { username, name, address, cp, phone, total, status, products } =
        order;
      const number = (await this.getCount()) + 1;
      const orderData = {
        number,
        username,
        name,
        address,
        cp,
        phone,
        total,
        status
      };
      const newOrder = await this.orders.save(orderData);
      const dataToSave = [];
      for (const prod of products) {
        removeField(prod.product, "timestamp");
        const productInOrder = {
          id_order: newOrder.id,
          ...prod.product,
          quantity: prod.quantity
        };
        dataToSave.push(productInOrder);
      }
      await this.productsInOrders.save(dataToSave);
      newOrder.products = products;
      logger.debug("Orden guardada con éxito");
      return newOrder;
    } catch (error) {
      throw new Error(`Error al guardar la orden: ${error}`);
    }
  }

  async getAll() {
    try {
      const [ordersPromise, productsPromise] = await Promise.allSettled([
        this.orders.getAll(),
        this.productsInOrders.getAll()
      ]);
      if (
        ordersPromise.status === "rejected" ||
        productsPromise.status === "rejected"
      )
        throw new Error("No se pudo acceder completamente a la información");
      const ordersData = ordersPromise.value;
      const productsInOrders = productsPromise.value;
      const ordersDic = {};
      ordersData.forEach(
        orderData => (ordersDic[orderData.id] = { ...orderData, products: [] })
      );
      productsInOrders.forEach(product => {
        const idOrder = removeField(product, "id_order");
        const quantity = removeField(product, "quantity");
        const cartItem = { product, quantity };
        ordersDic[idOrder].products.push(cartItem);
      });
      return Object.values(ordersDic);
    } catch (error) {
      throw new Error(`No se pudo recuperar las órdenes: ${error}`);
    }
  }

  // Obtengo las órdenes por su id
  async getById(id_order) {
    try {
      id_order = parseInt(id_order);
      const [orderPromise, productsPromise] = await Promise.allSettled([
        this.orders.getById(id_order),
        this.productsInCarts.getAll({ id_order })
      ]);
      if (
        orderPromise.status === "rejected" ||
        productsPromise.status === "rejected"
      )
        throw new Error("No se pudo acceder completamente a la información");
      const orderData = orderPromise.value;
      const productsInOrder = productsPromise.value;
      if (orderData) {
        const order = { ...orderData, products: [] };
        productsInOrder.forEach(product => {
          const quantity = removeField(product, "quantity");
          removeField(product, "id_order");
          const cartItem = { product, quantity };
          order.products.push(cartItem);
        });
        return order;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Error al obtener la orden con id '${id_order}': ${error}`
      );
    }
  }

  //Obtengo las órdenes por username
  async getByUsername(username) {
    try {
      const ordersData = await this.orders.getAll({ username });
      if (ordersData.length > 0) {
        const ordersDic = {};
        ordersData.forEach(
          orderData =>
            (ordersDic[orderData.id] = { ...orderData, products: [] })
        );
        const orderIds = Object.keys(ordersDic);
        let productsInOrders = await this.productsInOrders
          .knex("products_in_orders")
          .whereIn("id_order", orderIds)
          .select("*");
        productsInOrders.forEach(product => verifyTimestamp(product));
        productsInOrders = deepClone(productsInOrders);
        productsInOrders.forEach(product => {
          const idOrder = removeField(product, "id_order");
          const quantity = removeField(product, "quantity");
          const cartItem = { product, quantity };
          ordersDic[idOrder].products.push(cartItem);
        });
        return Object.values(ordersDic).sort((a, b) => b.number - a.number);
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(
        `Error al obtener las órdenes con username:'${username}': ${error}`
      );
    }
  }
}

export default OrdersDaoSQL;
