import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import config from "../../../config.js";

class MessagesDAOSQLite3 extends BaseDAOSQL {
  constructor() {
    super(config.sqlite3, "messages");
  }
}

export default MessagesDAOSQLite3;
