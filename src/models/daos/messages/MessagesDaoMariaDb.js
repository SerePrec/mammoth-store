import ContenedorSQL from "../../containers/ContenedorSQL.js";
import config from "../../../config.js";

class MessagesDaoMariaDb extends ContenedorSQL {
  constructor() {
    super(config.mariaDb, "messages");
  }
}

export default MessagesDaoMariaDb;
