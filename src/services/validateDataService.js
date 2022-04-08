import Joi from "joi";
import { Message } from "../models/entities/Message.js";
import { Product } from "../models/entities/Product.js";
import { User } from "../models/entities/User.js";
import { escapeHtml } from "../utils/dataTools.js";
import config from "../config.js";
import { logger } from "../logger/index.js";

class ValidateDataService {
  // Valida que sea id numérico o alfanumérico según el tipo de persistencia
  validateId = id => {
    const persWithNumId = ["mem", "fs", "mariadb", "sqlite3"];
    const pers = config.PERS;
    const idSchema = persWithNumId.includes(pers)
      ? Joi.number().integer().positive().required()
      : Joi.string().alphanum().required();
    const { error, value } = idSchema.validate(id);
    if (error) {
      logger.error(`Error de validación: ${error.message}`);
      return { error: `El id: ${id} no es de un formato válido` };
    }
    return value;
  };

  //Valida que el formato de datos a guardar sea válido
  // validatePostProductBody = data => {
  //   const validProduct = Product.validate(data, true);
  //   return validProduct
  //     ? validProduct
  //     : { error: "El formato de datos o los valores enviados no son válidos" };
  // };

  //Valida que el formato de datos a actualizar sea válido
  // validatePutProductBody = data => {
  //   const validData = Product.validate(data);
  //   if (!validData)
  //     return {
  //       error: "El formato de datos o los valores enviados no son válidos"
  //     };
  //   else if (Object.keys(validData)?.length === 0)
  //     return {
  //       error: "No hay campos válidos para actualizar"
  //     };
  //   else {
  //     return validData;
  //   }
  // };

  // Valida que sea un formato de usuario válido para guardar en la BD
  validateRegisterPost = data => {
    const validUser = User.validate(data, true);
    if (validUser) {
      validUser.username = escapeHtml(validUser.username);
      validUser.name = escapeHtml(validUser.name);
      validUser.address = escapeHtml(validUser.address);
      return validUser;
    }
    return false;
  };

  // Valida que sea un formato de mensaje válido para guardar en la BD
  // validateMessage = data => {
  //   const validMessage = Message.validate(data, true);
  //   return validMessage
  //     ? validMessage
  //     : { error: "El formato de datos o los valores enviados no son válidos" };
  // };
}

export default ValidateDataService;
