import Joi from "joi";
import { Cart } from "../models/entities/Cart.js";
import { Message } from "../models/entities/Message.js";
import { Order } from "../models/entities/Order.js";
import { Product } from "../models/entities/Product.js";
import { User } from "../models/entities/User.js";
import { escapeHtml } from "../utils/dataTools.js";
import { logger } from "../logger/index.js";
import config from "../config.js";

class ValidateDataService {
  // Valida que sea id numérico o alfanumérico según el tipo de persistencia
  validateId = id => {
    const persWithNumId = ["mem", "fs", "mariadb", "sqlite3", "cleardb"];
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

  // Valida que el formato de datos del producto a actualizar sea válido
  validateProductPutBody = (data, filename) => {
    filename ? (data.thumbnail = `/img/productos/${filename}`) : null;
    const validData = Product.validate(data, false);
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

  // Valida que el formato de datos del usuario a guardar sea válido
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
    return {
      error: "El formato de datos o los valores enviados no son válidos"
    };
  };

  // Valida que el formato de datos recibidos del producto a incorporar o actualizar en el carrito sea válido
  validateCartProductBody = data => {
    const validatedId = this.validateId(data.id);
    if (validatedId && validatedId.error) return validatedId;
    data.id = validatedId;
    const bodySchema = Joi.object({
      id: Joi.required(),
      quantity: Joi.number().integer().positive().required()
    });
    const { error, value } = bodySchema.validate(data);
    if (error) {
      logger.error(`Error de validación: ${error.message}`);
      return {
        error: "El formato de datos o los valores enviados no son válidos"
      };
    }
    return value;
  };

  // Valida que el formato de datos del carrito a crear o actualizar sea válido
  validateCart = (data, isRequired) => {
    const validatedCart = Cart.validate(data, isRequired);
    if (validatedCart) return validatedCart;
    return {
      error: "El formato de datos o los valores no son válidos"
    };
  };

  // Valida que el formato de datos recibidos sea válido para generar una órden
  validateOrderPost = data => {
    const validatedId = this.validateId(data.id);
    if (validatedId && validatedId.error) return validatedId;
    delete data["id"];
    const validOrder = Order.validateInput(data, true);
    if (validOrder) {
      validOrder.id = validatedId;
      validOrder.name = escapeHtml(validOrder.name);
      validOrder.address = escapeHtml(validOrder.address);
      return validOrder;
    }
    return {
      error: "El formato de datos o los valores enviados no son válidos"
    };
  };

  // Valida que el formato de datos recibidos sea válido para cambiar el estado de una órden
  validateOrderStatusPutBody = data => {
    const validatedStatus = Order.validateStatus(data);
    if (validatedStatus) return validatedStatus;
    return {
      error: "El formato de datos o los valores enviados no son válidos"
    };
  };

  // Valida que el formato de datos de la orden a crear o actualizar sea válido
  validateOrder = (data, isRequired) => {
    const validatedOrder = Order.validate(data, isRequired);
    if (validatedOrder) return validatedOrder;
    return {
      error: "El formato de datos o los valores no son válidos"
    };
  };

  // Valida que el formato de datos del mensaje a guardar sea válido
  validateMessage = data => {
    const validMessage = Message.validate(data, true);
    if (validMessage) {
      validMessage.text = escapeHtml(validMessage.text);
      validMessage.replyMessage = escapeHtml(validMessage.replyMessage);
      return validMessage;
    }
    return {
      error: "El formato de datos o los valores enviados no son válidos"
    };
  };
}

export default ValidateDataService;
