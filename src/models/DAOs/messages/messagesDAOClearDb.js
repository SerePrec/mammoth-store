import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import { MessageDTO } from "../../DTOs/messageDTO.js";
import config from "../../../config.js";

class MessagesDAOClearDb extends BaseDAOSQL {
  static #instance;

  constructor() {
    if (MessagesDAOClearDb.#instance) {
      return MessagesDAOClearDb.#instance;
    }
    super(config.clearDb, "messages", MessageDTO);
    MessagesDAOClearDb.#instance = this;
  }
}

export default MessagesDAOClearDb;
