import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import { MessageDTO } from "../../DTOs/messageDTO.js";
import config from "../../../config.js";

class MessagesDAOSQLite3 extends BaseDAOSQL {
  static #instance;

  constructor() {
    if (MessagesDAOSQLite3.#instance) {
      return MessagesDAOSQLite3.#instance;
    }
    super(config.sqlite3, "messages", MessageDTO);
    MessagesDAOSQLite3.#instance = this;
  }
}

export default MessagesDAOSQLite3;
