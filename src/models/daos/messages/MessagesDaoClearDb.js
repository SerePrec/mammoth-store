import ContenedorSQL from "../../containers/ContenedorSQL.js";
import config from "../../../config.js";

class MessagesDaoClearDb extends ContenedorSQL {
  constructor() {
    super(config.clearDb, "messages");
  }
}

export default MessagesDaoClearDb;
