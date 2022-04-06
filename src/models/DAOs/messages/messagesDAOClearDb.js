import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import config from "../../../config.js";

class MessagesDAOClearDb extends BaseDAOSQL {
  constructor() {
    super(config.clearDb, "messages");
  }
}

export default MessagesDAOClearDb;
