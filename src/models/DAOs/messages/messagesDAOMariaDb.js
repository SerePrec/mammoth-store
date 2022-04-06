import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import config from "../../../config.js";

class MessagesDAOMariaDb extends BaseDAOSQL {
  constructor() {
    super(config.mariaDb, "messages");
  }
}

export default MessagesDAOMariaDb;
