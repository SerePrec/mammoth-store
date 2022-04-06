import BaseDAOMem from "../../baseDAOs/baseDAOMem.js";
import { MessageDTO } from "../../DTOs/messageDTO.js";

class MessagesDAOMem extends BaseDAOMem {
  static #instance;

  constructor() {
    if (MessagesDAOMem.#instance) {
      return MessagesDAOMem.#instance;
    }
    super(MessageDTO);
    MessagesDAOMem.#instance = this;
  }
}

export default MessagesDAOMem;
