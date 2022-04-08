class MessagesDAOFactory {
  static async get(PERS) {
    switch (PERS) {
      case "cleardb": {
        const { default: MessagesDAOClearDb } = await import(
          "./messagesDAOClearDb.js"
        );
        return new MessagesDAOClearDb();
      }
      case "firebase": {
        const { default: MessagesDAOFirebase } = await import(
          "./messagesDAOFirebase.js"
        );
        return new MessagesDAOFirebase();
      }
      case "fs": {
        const { default: MessagesDAOFS } = await import("./messagesDAOFS.js");
        return new MessagesDAOFS();
      }
      case "mariadb": {
        const { default: MessagesDAOMariaDb } = await import(
          "./messagesDAOMariaDb.js"
        );
        return new MessagesDAOMariaDb();
      }
      case "mongodb":
      case "mongodb_atlas": {
        const { default: MessagesDAOMongoDB } = await import(
          "./messagesDAOMongoDB.js"
        );
        return new MessagesDAOMongoDB();
      }
      case "sqlite3": {
        const { default: MessagesDAOSQLite3 } = await import(
          "./messagesDAOSQLite3.js"
        );
        return new MessagesDAOSQLite3();
      }
      case "mem":
      default: {
        const { default: MessagesDAOMem } = await import("./messagesDAOMem.js");
        return new MessagesDAOMem();
      }
    }
  }
}

export default MessagesDAOFactory;
