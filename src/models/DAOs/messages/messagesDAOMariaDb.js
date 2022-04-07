import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import { MessageDTO } from "../../DTOs/messageDTO.js";
import config from "../../../config.js";

class MessagesDAOMariaDb extends BaseDAOSQL {
  static #instance;

  constructor() {
    if (MessagesDAOMariaDb.#instance) {
      return MessagesDAOMariaDb.#instance;
    }
    super(config.mariaDb, "messages", MessageDTO);
    MessagesDAOMariaDb.#instance = this;
  }
}

export default MessagesDAOMariaDb;
