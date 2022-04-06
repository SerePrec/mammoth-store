import BaseDAOMongoDB from "../../baseDAOs/baseDAOMongoDB.js";
import { messageSchema } from "../../schemas/messageSchemaMongoDB.js";
import { MessageDTO } from "../../DTOs/messageDTO.js";

class MessagesDAOMongoDB extends BaseDAOMongoDB {
  static #instance;

  constructor() {
    if (MessagesDAOMongoDB.#instance) {
      return MessagesDAOMongoDB.#instance;
    }
    super("Message", messageSchema, MessageDTO);
    MessagesDAOMongoDB.#instance = this;
  }
}

export default MessagesDAOMongoDB;
