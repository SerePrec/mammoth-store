import ContenedorFS from "../../containers/ContenedorFS.js";
import config from "../../../config.js";

class MessagesDaoFS extends ContenedorFS {
  constructor() {
    super(config.fileSystemDb.messagesFile);
  }
}

export default MessagesDaoFS;
