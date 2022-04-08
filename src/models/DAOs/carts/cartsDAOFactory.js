class CartsDAOFactory {
  static async get(PERS) {
    switch (PERS) {
      case "cleardb": {
        const { default: CartsDAOClearDb } = await import(
          "./cartsDAOClearDb.js"
        );
        return new CartsDAOClearDb();
      }
      case "firebase": {
        const { default: CartsDAOFirebase } = await import(
          "./cartsDAOFirebase.js"
        );
        return new CartsDAOFirebase();
      }
      case "fs": {
        const { default: CartsDAOFS } = await import("./cartsDAOFS.js");
        return new CartsDAOFS();
      }
      case "mariadb": {
        const { default: CartsDAOMariaDb } = await import(
          "./cartsDAOMariaDb.js"
        );
        return new CartsDAOMariaDb();
      }
      case "mongodb":
      case "mongodb_atlas": {
        const { default: CartsDAOMongoDB } = await import(
          "./cartsDAOMongoDB.js"
        );
        return new CartsDAOMongoDB();
      }
      case "sqlite3": {
        const { default: CartsDAOSQLite3 } = await import(
          "./cartsDAOSQLite3.js"
        );
        return new CartsDAOSQLite3();
      }
      case "mem":
      default: {
        const { default: CartsDAOMem } = await import("./cartsDAOMem.js");
        return new CartsDAOMem();
      }
    }
  }
}

export default CartsDAOFactory;
