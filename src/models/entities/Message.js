import Joi from "joi";
import { logger } from "../../logger/index.js";

export class Message {
  constructor(user, type, text, replyMessage) {
    this.user = user;
    this.type = type;
    this.text = text;
    this.replyMessage = replyMessage;
  }

  static getMessageSchema(isRequired) {
    return Joi.object({
      user: isRequired ? Joi.string().trim().required() : Joi.string().trim(),
      type: isRequired ? Joi.string().trim().required() : Joi.string().trim(),
      text: isRequired ? Joi.string().trim().required() : Joi.string().trim(),
      replyMessage: isRequired
        ? Joi.alternatives().try(Joi.string().trim(), null).required()
        : Joi.alternatives().try(Joi.string().trim(), null)
    });
  }

  static validate(message, isRequired = true) {
    const MessageSchema = Message.getMessageSchema(isRequired);
    const { error, value } = MessageSchema.validate(message);
    if (error) {
      logger.error(`Error de validación: ${error.message}`);
      return false;
    }
    return value;
  }
}
