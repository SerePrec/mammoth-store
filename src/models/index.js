import config from "../config.js";
import { logger } from "../logger/index.js";

let productsModel;
let cartsModel;
let messagesModel;
let usersModel;
let ordersModel;

switch (config.PERS) {
  case "fs": {
    const { default: ProductsDAOFS } = await import(
      "./DAOs/products/productsDAOFS.js"
    );
    const { default: CartsDAOFS } = await import("./DAOs/carts/cartsDAOFS.js");
    const { default: MessagesDAOFS } = await import(
      "./DAOs/messages/messagesDAOFS.js"
    );
    const { default: UsersDAOFS } = await import("./DAOs/users/usersDAOFS.js");
    const { default: OrdersDAOFS } = await import(
      "./DAOs/orders/ordersDAOFS.js"
    );
    productsModel = new ProductsDAOFS();
    cartsModel = new CartsDAOFS();
    messagesModel = new MessagesDAOFS();
    usersModel = new UsersDAOFS();
    ordersModel = new OrdersDAOFS();
    //Inicializo mi "storage"
    try {
      await productsModel.init();
      await cartsModel.init();
      await messagesModel.init();
      await usersModel.init();
      await ordersModel.init();
      logger.info("Persistencia [File System] inicializada");
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
    break;
  }

  case "mariadb": {
    const { default: ProductsDAOMariaDb } = await import(
      "./DAOs/products/productsDAOMariaDb.js"
    );
    const { default: CartsDAOMariaDb } = await import(
      "./DAOs/carts/cartsDAOMariaDb.js"
    );
    const { default: MessagesDAOMariaDb } = await import(
      "./DAOs/messages/messagesDAOMariaDb.js"
    );
    const { default: UsersDAOMariaDb } = await import(
      "./DAOs/users/usersDAOMariaDb.js"
    );
    const { default: OrdersDAOMariaDb } = await import(
      "./DAOs/orders/ordersDAOMariaDb.js"
    );
    productsModel = new ProductsDAOMariaDb();
    cartsModel = new CartsDAOMariaDb();
    messagesModel = new MessagesDAOMariaDb();
    usersModel = new UsersDAOMariaDb();
    ordersModel = new OrdersDAOMariaDb();
    logger.info("Persistencia [MariaDB] inicializada");
    break;
  }

  case "cleardb": {
    const { default: ProductsDAOClearDb } = await import(
      "./DAOs/products/productsDAOClearDb.js"
    );
    const { default: CartsDAOClearDb } = await import(
      "./DAOs/carts/cartsDAOClearDb.js"
    );
    const { default: MessagesDAOClearDb } = await import(
      "./DAOs/messages/messagesDAOClearDb.js"
    );
    const { default: UsersDAOClearDb } = await import(
      "./DAOs/users/usersDAOClearDb.js"
    );
    const { default: OrdersDAOClearDb } = await import(
      "./DAOs/orders/ordersDAOClearDb.js"
    );
    productsModel = new ProductsDAOClearDb();
    cartsModel = new CartsDAOClearDb();
    messagesModel = new MessagesDAOClearDb();
    usersModel = new UsersDAOClearDb();
    ordersModel = new OrdersDAOClearDb();
    logger.info("Persistencia [ClearDB] inicializada");
    break;
  }

  case "sqlite3": {
    const { default: ProductsDAOSQLite3 } = await import(
      "./DAOs/products/productsDAOSQLite3.js"
    );
    const { default: CartsDAOSQLite3 } = await import(
      "./DAOs/carts/cartsDAOSQLite3.js"
    );
    const { default: MessagesDAOSQLite3 } = await import(
      "./DAOs/messages/messagesDAOSQLite3.js"
    );
    const { default: UsersDAOSQLite3 } = await import(
      "./DAOs/users/usersDAOSQLite3.js"
    );
    const { default: OrdersDAOSQLite3 } = await import(
      "./DAOs/orders/ordersDAOSQLite3.js"
    );
    productsModel = new ProductsDAOSQLite3();
    cartsModel = new CartsDAOSQLite3();
    messagesModel = new MessagesDAOSQLite3();
    usersModel = new UsersDAOSQLite3();
    ordersModel = new OrdersDAOSQLite3();
    logger.info("Persistencia [SQLite3] inicializada");
    break;
  }

  case "mongodb":
  case "mongodb_atlas": {
    const { default: ProductsDAOMongoDB } = await import(
      "./DAOs/products/productsDAOMongoDB.js"
    );
    const { default: CartsDAOMongoDB } = await import(
      "./DAOs/carts/cartsDAOMongoDB.js"
    );
    const { default: MessagesDAOMongoDB } = await import(
      "./DAOs/messages/messagesDAOMongoDB.js"
    );
    const { default: UsersDAOMongoDB } = await import(
      "./DAOs/users/usersDAOMongoDB.js"
    );
    const { default: OrdersDAOMongoDB } = await import(
      "./DAOs/orders/ordersDAOMongoDB.js"
    );
    productsModel = new ProductsDAOMongoDB();
    cartsModel = new CartsDAOMongoDB();
    messagesModel = new MessagesDAOMongoDB();
    usersModel = new UsersDAOMongoDB();
    ordersModel = new OrdersDAOMongoDB();
    logger.info("Persistencia [MongoDB] inicializada");
    break;
  }

  case "firebase": {
    const { default: ProductsDAOFirebase } = await import(
      "./DAOs/products/productsDAOFirebase.js"
    );
    const { default: CartsDAOFirebase } = await import(
      "./DAOs/carts/cartsDAOFirebase.js"
    );
    const { default: MessagesDAOFirebase } = await import(
      "./DAOs/messages/messagesDAOFirebase.js"
    );
    const { default: UsersDAOFirebase } = await import(
      "./DAOs/users/usersDAOFirebase.js"
    );
    const { default: OrdersDAOFirebase } = await import(
      "./DAOs/orders/ordersDAOFirebase.js"
    );
    productsModel = new ProductsDAOFirebase();
    cartsModel = new CartsDAOFirebase();
    messagesModel = new MessagesDAOFirebase();
    usersModel = new UsersDAOFirebase();
    ordersModel = new OrdersDAOFirebase();
    logger.info("Persistencia [Firebase] inicializada");
    break;
  }

  case "mem":
  default: {
    const { default: ProductsDAOMem } = await import(
      "./DAOs/products/productsDAOMem.js"
    );
    const { default: CartsDAOMem } = await import(
      "./DAOs/carts/cartsDAOMem.js"
    );
    const { default: MessagesDAOMem } = await import(
      "./DAOs/messages/messagesDAOMem.js"
    );
    const { default: UsersDAOMem } = await import(
      "./DAOs/users/usersDAOMem.js"
    );
    const { default: OrdersDAOMem } = await import(
      "./DAOs/orders/ordersDAOMem.js"
    );
    productsModel = new ProductsDAOMem();
    cartsModel = new CartsDAOMem();
    messagesModel = new MessagesDAOMem();
    usersModel = new UsersDAOMem();
    ordersModel = new OrdersDAOMem();
    logger.info("Persistencia [Memoria] inicializada");
    break;
  }
}

export { productsModel, cartsModel, messagesModel, usersModel, ordersModel };
