import ContenedorSQL from "../../containers/ContenedorSQL.js";
import config from "../../../config.js";

class MessagesDaoSQLite3 extends ContenedorSQL {
  constructor() {
    super(config.sqlite3, "messages");
  }
}

export default MessagesDaoSQLite3;
