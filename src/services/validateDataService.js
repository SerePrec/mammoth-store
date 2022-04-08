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

  // Valida que el formato de datos del producto a guardar sea válido
  validateProductPostBody = (data, filename) => {
    data.thumbnail = data.thumbnail?.trim()
      ? data.thumbnail?.trim()
      : `/img/productos/generic_product.svg`;
    data.thumbnail = filename ? `/img/productos/${filename}` : data.thumbnail;
    const validProduct = Product.validate(data, true);
    if (validProduct) {
      validProduct.title = escapeHtml(validProduct.title);
      validProduct.detail = escapeHtml(validProduct.detail);
      validProduct.code = escapeHtml(validProduct.code);
      validProduct.brand = escapeHtml(validProduct.brand);
      validProduct.category = escapeHtml(validProduct.category);
      return validProduct;
    }
    return {
      error: "El formato de datos o los valores enviados no son válidos"
    };
  };

  //Valida que el formato de datos del producto a actualizar sea válido
  validateProductPutBody = (data, filename) => {
    console.log(data, filename);
    filename ? (data.thumbnail = `/img/productos/${filename}`) : null;
    console.log(data);
    const validData = Product.validate(data, false);
    console.log(validData);
    if (!validData)
      return {
        error: "El formato de datos o los valores enviados no son válidos"
      };
    else if (Object.keys(validData)?.length === 0)
      return {
        error: "No hay campos válidos para actualizar"
      };
    else {
      validData.title ? (validData.title = escapeHtml(validData.title)) : null;
      validData.detail
        ? (validData.detail = escapeHtml(validData.detail))
        : null;
      validData.code ? (validData.code = escapeHtml(validData.code)) : null;
      validData.brand ? (validData.brand = escapeHtml(validData.brand)) : null;
      validData.category
        ? (validData.category = escapeHtml(validData.category))
        : null;
      return validData;
    }
  };

  // Valida que sea un formato de usuario válido para guardar en la BD
  validateRegisterPost = (data, filename) => {
    const avatar = filename
      ? `/img/avatars/${filename}`
      : `/img/avatars/default_avatar.svg`;
    data.avatar = avatar;
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
