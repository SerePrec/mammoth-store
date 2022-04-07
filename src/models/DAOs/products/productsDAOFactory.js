class ProductsDAOFactory {
  static async get(PERS) {
    switch (PERS) {
      case "cleardb": {
        const { default: ProductsDAOClearDb } = await import(
          "./productsDAOClearDb.js"
        );
        return new ProductsDAOClearDb();
      }
      case "fs": {
        const { default: ProductsDAOFS } = await import("./productsDAOFS.js");
        return new ProductsDAOFS();
      }
      case "mariadb": {
        const { default: ProductsDAOMariaDb } = await import(
          "./productsDAOMariaDb.js"
        );
        return new ProductsDAOMariaDb();
      }
      case "mongodb":
      case "mongodb_atlas": {
        const { default: ProductsDAOMongoDB } = await import(
          "./productsDAOMongoDB.js"
        );
        return new ProductsDAOMongoDB();
      }
      case "sqlite3": {
        const { default: ProductsDAOSQLite3 } = await import(
          "./productsDAOSQLite3.js"
        );
        return new ProductsDAOSQLite3();
      }
      case "mem":
      default: {
        const { default: ProductsDAOMem } = await import("./productsDAOMem.js");
        return new ProductsDAOMem();
      }
    }
  }
}

export default ProductsDAOFactory;
