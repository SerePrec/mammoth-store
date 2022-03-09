import config from "../config.js";
import { logger } from "../logger/index.js";

let productsModel;
let cartsModel;
let messagesModel;
let usersModel;
let ordersModel;

switch (config.PERS) {
  case "fs": {
    const { default: ProductsDaoFS } = await import(
      "./daos/products/ProductsDaoFS.js"
    );
    const { default: CartsDaoFS } = await import("./daos/carts/CartsDaoFS.js");
    const { default: MessagesDaoFS } = await import(
      "./daos/messages/MessagesDaoFS.js"
    );
    const { default: UsersDaoFS } = await import("./daos/users/UsersDaoFS.js");
    const { default: OrdersDaoFS } = await import(
      "./daos/orders/OrdersDaoFS.js"
    );
    productsModel = new ProductsDaoFS();
    cartsModel = new CartsDaoFS();
    messagesModel = new MessagesDaoFS();
    usersModel = new UsersDaoFS();
    ordersModel = new OrdersDaoFS();
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
    const { default: ProductsDaoMariaDb } = await import(
      "./daos/products/ProductsDaoMariaDb.js"
    );
    const { default: CartsDaoMariaDb } = await import(
      "./daos/carts/CartsDaoMariaDb.js"
    );
    const { default: MessagesDaoMariaDb } = await import(
      "./daos/messages/MessagesDaoMariaDb.js"
    );
    const { default: UsersDaoMariaDb } = await import(
      "./daos/users/UsersDaoMariaDb.js"
    );
    const { default: OrdersDaoMariaDb } = await import(
      "./daos/orders/OrdersDaoMariaDb.js"
    );
    productsModel = new ProductsDaoMariaDb();
    cartsModel = new CartsDaoMariaDb();
    messagesModel = new MessagesDaoMariaDb();
    usersModel = new UsersDaoMariaDb();
    ordersModel = new OrdersDaoMariaDb();
    logger.info("Persistencia [MariaDB] inicializada");
    break;
  }

  case "cleardb": {
    const { default: ProductsDaoClearDb } = await import(
      "./daos/products/ProductsDaoClearDb.js"
    );
    const { default: CartsDaoClearDb } = await import(
      "./daos/carts/CartsDaoClearDb.js"
    );
    const { default: MessagesDaoClearDb } = await import(
      "./daos/messages/MessagesDaoClearDb.js"
    );
    const { default: UsersDaoClearDb } = await import(
      "./daos/users/UsersDaoClearDb.js"
    );
    const { default: OrdersDaoClearDb } = await import(
      "./daos/orders/OrdersDaoClearDb.js"
    );
    productsModel = new ProductsDaoClearDb();
    cartsModel = new CartsDaoClearDb();
    messagesModel = new MessagesDaoClearDb();
    usersModel = new UsersDaoClearDb();
    ordersModel = new OrdersDaoClearDb();
    logger.info("Persistencia [ClearDB] inicializada");
    break;
  }

  case "sqlite3": {
    const { default: ProductsDaoSQLite3 } = await import(
      "./daos/products/ProductsDaoSQLite3.js"
    );
    const { default: CartsDaoSQLite3 } = await import(
      "./daos/carts/CartsDaoSQLite3.js"
    );
    const { default: MessagesDaoSQLite3 } = await import(
      "./daos/messages/MessagesDaoSQLite3.js"
    );
    const { default: UsersDaoSQLite3 } = await import(
      "./daos/users/UsersDaoSQLite3.js"
    );
    const { default: OrdersDaoSQLite3 } = await import(
      "./daos/orders/OrdersDaoSQLite3.js"
    );
    productsModel = new ProductsDaoSQLite3();
    cartsModel = new CartsDaoSQLite3();
    messagesModel = new MessagesDaoSQLite3();
    usersModel = new UsersDaoSQLite3();
    ordersModel = new OrdersDaoSQLite3();
    logger.info("Persistencia [SQLite3] inicializada");
    break;
  }

  case "mongodb":
  case "mongodb_atlas": {
    const { default: ProductsDaoMongoDB } = await import(
      "./daos/products/ProductsDaoMongoDB.js"
    );
    const { default: CartsDaoMongoDB } = await import(
      "./daos/carts/CartsDaoMongoDB.js"
    );
    const { default: MessagesDaoMongoDB } = await import(
      "./daos/messages/MessagesDaoMongoDB.js"
    );
    const { default: UsersDaoMongoDB } = await import(
      "./daos/users/UsersDaoMongoDB.js"
    );
    const { default: OrdersDaoMongoDB } = await import(
      "./daos/orders/OrdersDaoMongoDB.js"
    );
    productsModel = new ProductsDaoMongoDB();
    cartsModel = new CartsDaoMongoDB();
    messagesModel = new MessagesDaoMongoDB();
    usersModel = new UsersDaoMongoDB();
    ordersModel = new OrdersDaoMongoDB();
    logger.info("Persistencia [MongoDB] inicializada");
    break;
  }

  case "firebase": {
    const { default: ProductsDaoFirebase } = await import(
      "./daos/products/ProductsDaoFirebase.js"
    );
    const { default: CartsDaoFirebase } = await import(
      "./daos/carts/CartsDaoFirebase.js"
    );
    const { default: MessagesDaoFirebase } = await import(
      "./daos/messages/MessagesDaoFirebase.js"
    );
    const { default: UsersDaoFirebase } = await import(
      "./daos/users/UsersDaoFirebase.js"
    );
    const { default: OrdersDaoFirebase } = await import(
      "./daos/orders/OrdersDaoFirebase.js"
    );
    productsModel = new ProductsDaoFirebase();
    cartsModel = new CartsDaoFirebase();
    messagesModel = new MessagesDaoFirebase();
    usersModel = new UsersDaoFirebase();
    ordersModel = new OrdersDaoFirebase();
    logger.info("Persistencia [Firebase] inicializada");
    break;
  }

  case "mem":
  default: {
    const { default: ProductsDaoMem } = await import(
      "./daos/products/ProductsDaoMem.js"
    );
    const { default: CartsDaoMem } = await import(
      "./daos/carts/CartsDaoMem.js"
    );
    const { default: MessagesDaoMem } = await import(
      "./daos/messages/MessagesDaoMem.js"
    );
    const { default: UsersDaoMem } = await import(
      "./daos/users/UsersDaoMem.js"
    );
    const { default: OrdersDaoMem } = await import(
      "./daos/orders/OrdersDaoMem.js"
    );
    productsModel = new ProductsDaoMem();
    cartsModel = new CartsDaoMem();
    messagesModel = new MessagesDaoMem();
    usersModel = new UsersDaoMem();
    ordersModel = new OrdersDaoMem();
    logger.info("Persistencia [Memoria] inicializada");
    break;
  }
}

export { productsModel, cartsModel, messagesModel, usersModel, ordersModel };
