import BaseDAOFS from "../../baseDAOs/baseDAOFS.js";
import { MessageDTO } from "../../DTOs/messageDTO.js";
import config from "../../../config.js";

class MessagesDAOFS extends BaseDAOFS {
  static #instance;

  constructor() {
    if (MessagesDAOFS.#instance) {
      return MessagesDAOFS.#instance;
    }
    super(config.fileSystemDb.messagesFile, MessageDTO);
    MessagesDAOFS.#instance = this;
  }
}

export default MessagesDAOFS;
