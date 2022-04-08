import { messagesModel } from "../models/index.js";
import ValidateDataService from "./validateDataService.js";
import { MessageDTO } from "../models/DTOs/messageDTO.js";

const validateDataService = new ValidateDataService();

class MessagesService {
  constructor() {
    this.messagesModel = messagesModel;
  }

  getAll = async () => await this.messagesModel.getAll();

  save = async message => {
    const validMessage = validateDataService.validateMessage(message);
    if (validMessage && validMessage.error) throw new Error(validMessage.error);
    return await this.messagesModel.save(new MessageDTO(validMessage));
  };
}

export default MessagesService;
