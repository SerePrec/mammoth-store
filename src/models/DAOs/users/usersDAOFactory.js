class UsersDAOFactory {
  static async get(PERS) {
    switch (PERS) {
      case "cleardb": {
        const { default: UsersDAOClearDb } = await import(
          "./usersDAOClearDb.js"
        );
        return new UsersDAOClearDb();
      }
      case "firebase": {
        const { default: UsersDAOFirebase } = await import(
          "./usersDAOFirebase.js"
        );
        return new UsersDAOFirebase();
      }
      case "fs": {
        const { default: UsersDAOFS } = await import("./usersDAOFS.js");
        return new UsersDAOFS();
      }
      case "mariadb": {
        const { default: UsersDAOMariaDb } = await import(
          "./usersDAOMariaDb.js"
        );
        return new UsersDAOMariaDb();
      }
      case "mongodb":
      case "mongodb_atlas": {
        const { default: UsersDAOMongoDB } = await import(
          "./usersDAOMongoDB.js"
        );
        return new UsersDAOMongoDB();
      }
      case "sqlite3": {
        const { default: UsersDAOSQLite3 } = await import(
          "./usersDAOSQLite3.js"
        );
        return new UsersDAOSQLite3();
      }
      case "mem":
      default: {
        const { default: UsersDAOMem } = await import("./usersDAOMem.js");
        return new UsersDAOMem();
      }
    }
  }
}

export default UsersDAOFactory;
