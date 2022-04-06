import BaseDAOFS from "../../baseDAOs/baseDAOFS.js";
import config from "../../../config.js";

class MessagesDAOFS extends BaseDAOFS {
  constructor() {
    super(config.fileSystemDb.messagesFile);
  }
}

export default MessagesDAOFS;
