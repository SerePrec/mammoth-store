class OrdersDAOFactory {
  static async get(PERS) {
    switch (PERS) {
      case "cleardb": {
        const { default: OrdersDAOClearDb } = await import(
          "./ordersDAOClearDb.js"
        );
        return new OrdersDAOClearDb();
      }
      case "firebase": {
        const { default: OrdersDAOFirebase } = await import(
          "./ordersDAOFirebase.js"
        );
        return new OrdersDAOFirebase();
      }
      case "fs": {
        const { default: OrdersDAOFS } = await import("./ordersDAOFS.js");
        return new OrdersDAOFS();
      }
      case "mariadb": {
        const { default: OrdersDAOMariaDb } = await import(
          "./ordersDAOMariaDb.js"
        );
        return new OrdersDAOMariaDb();
      }
      case "mongodb":
      case "mongodb_atlas": {
        const { default: OrdersDAOMongoDB } = await import(
          "./ordersDAOMongoDB.js"
        );
        return new OrdersDAOMongoDB();
      }
      case "sqlite3": {
        const { default: OrdersDAOSQLite3 } = await import(
          "./ordersDAOSQLite3.js"
        );
        return new OrdersDAOSQLite3();
      }
      case "mem":
      default: {
        const { default: OrdersDAOMem } = await import("./ordersDAOMem.js");
        return new OrdersDAOMem();
      }
    }
  }
}

export default OrdersDAOFactory;
