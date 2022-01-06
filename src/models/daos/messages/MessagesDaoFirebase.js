import ContenedorFirebase from "../../containers/ContenedorFirebase.js";

class MessagesDaoFirebase extends ContenedorFirebase {
  constructor() {
    super("messages");
  }
}

export default MessagesDaoFirebase;
