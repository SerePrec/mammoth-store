let productsModel;
let cartsModel;
let messagesModel;

switch (process.env.PERS) {
  case "fs":
    const { default: ProductsDaoFS } = await import(
      "./daos/products/ProductsDaoFS.js"
    );
    const { default: CartsDaoFS } = await import("./daos/carts/CartsDaoFS.js");
    const { default: MessagesDaoFS } = await import(
      "./daos/messages/MessagesDaoFS.js"
    );
    productsModel = new ProductsDaoFS();
    cartsModel = new CartsDaoFS();
    messagesModel = new MessagesDaoFS();
    break;

  case "mariadb":
    const { default: ProductsDaoMariaDb } = await import(
      "./daos/products/ProductsDaoMariaDb.js"
    );
    const { default: CartsDaoMariaDb } = await import(
      "./daos/carts/CartsDaoMariaDb.js"
    );
    const { default: MessagesDaoMariaDb } = await import(
      "./daos/messages/MessagesDaoMariaDb.js"
    );
    productsModel = new ProductsDaoMariaDb();
    cartsModel = new CartsDaoMariaDb();
    messagesModel = new MessagesDaoMariaDb();
    cartsModel.deleteAll();
    break;

  case "sqlite3":
    const { default: ProductsDaoSQLite3 } = await import(
      "./daos/products/ProductsDaoSQLite3.js"
    );
    const { default: CartsDaoSQLite3 } = await import(
      "./daos/carts/CartsDaoSQLite3.js"
    );
    const { default: MessagesDaoSQLite3 } = await import(
      "./daos/messages/MessagesDaoSQLite3.js"
    );
    productsModel = new ProductsDaoSQLite3();
    cartsModel = new CartsDaoSQLite3();
    messagesModel = new MessagesDaoSQLite3();
    break;

  case "mem":
  default:
    const { default: ProductsDaoMem } = await import(
      "./daos/products/ProductsDaoMem.js"
    );
    const { default: CartsDaoMem } = await import(
      "./daos/carts/CartsDaoMem.js"
    );
    const { default: MessagesDaoMem } = await import(
      "./daos/messages/MessagesDaoMem.js"
    );
    productsModel = new ProductsDaoMem();
    cartsModel = new CartsDaoMem();
    messagesModel = new MessagesDaoMem();
    break;
}

export { productsModel, cartsModel, messagesModel };
