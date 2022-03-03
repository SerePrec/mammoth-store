import config from "../config.js";

let productsModel;
let cartsModel;
let messagesModel;
let usersModel;

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
    productsModel = new ProductsDaoFS();
    cartsModel = new CartsDaoFS();
    messagesModel = new MessagesDaoFS();
    usersModel = new UsersDaoFS();
    //Inicializo mi "storage"
    try {
      await productsModel.init();
      await cartsModel.init();
      await messagesModel.init();
      await usersModel.init();
    } catch (error) {
      console.log(error);
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
    productsModel = new ProductsDaoMariaDb();
    cartsModel = new CartsDaoMariaDb();
    messagesModel = new MessagesDaoMariaDb();
    usersModel = new UsersDaoMariaDb();
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
    productsModel = new ProductsDaoClearDb();
    cartsModel = new CartsDaoClearDb();
    messagesModel = new MessagesDaoClearDb();
    usersModel = new UsersDaoClearDb();
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
    productsModel = new ProductsDaoSQLite3();
    cartsModel = new CartsDaoSQLite3();
    messagesModel = new MessagesDaoSQLite3();
    usersModel = new UsersDaoSQLite3();
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
    productsModel = new ProductsDaoMongoDB();
    cartsModel = new CartsDaoMongoDB();
    messagesModel = new MessagesDaoMongoDB();
    usersModel = new UsersDaoMongoDB();
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
    productsModel = new ProductsDaoFirebase();
    cartsModel = new CartsDaoFirebase();
    messagesModel = new MessagesDaoFirebase();
    usersModel = new UsersDaoFirebase();
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
    productsModel = new ProductsDaoMem();
    cartsModel = new CartsDaoMem();
    messagesModel = new MessagesDaoMem();
    usersModel = new UsersDaoMem();
    break;
  }
}

export { productsModel, cartsModel, messagesModel, usersModel };
