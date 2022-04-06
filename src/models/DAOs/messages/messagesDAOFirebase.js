import BaseDAOFirebase from "../../baseDAOs/baseDAOFirebase.js";
import { MessageDTO } from "../../DTOs/messageDTO.js";

class MessagesDAOFirebase extends BaseDAOFirebase {
  static #instance;

  constructor() {
    if (MessagesDAOFirebase.#instance) {
      return MessagesDAOFirebase.#instance;
    }
    super("messages", MessageDTO);
    MessagesDAOFirebase.#instance = this;
  }
}

export default MessagesDAOFirebase;
