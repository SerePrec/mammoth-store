import mongoose from "mongoose";
import BaseDAOMongoDB from "../../baseDAOs/baseDAOMongoDB.js";

const { Schema } = mongoose;

const messageSchema = new Schema({
  user: { type: String, required: true },
  type: { type: String, required: true },
  text: { type: String, required: true },
  replyMessage: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

class MessagesDAOMongoDB extends BaseDAOMongoDB {
  constructor() {
    super("Message", messageSchema);
  }
}

export default MessagesDAOMongoDB;
