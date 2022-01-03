import ContenedorMongoDB from "../../containers/ContenedorMongoDB.js";

class MessagesDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super("Message", {
      user: { type: String, required: true },
      type: { type: String, required: true },
      text: { type: String, required: true },
      replyMessage: { type: String, default: null },
      timestamp: { type: Date, default: new Date() }
    });
  }
}

export default MessagesDaoMongoDB;
