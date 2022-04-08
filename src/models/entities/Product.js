import Joi from "joi";
import { logger } from "../../logger/index.js";

export class Product {
  constructor(title, detail, brand, code, category, price, stock, thumbnail) {
    this.title = title;
    this.detail = detail;
    this.brand = brand;
    this.code = code;
    this.category = category;
    this.price = price;
    this.stock = stock;
    this.thumbnail = thumbnail;
  }

  static urlPattern =
    /^(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}|[/])\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

  static getProductSchema(isRequired) {
    return Joi.object({
      title: isRequired ? Joi.string().trim().required() : Joi.string().trim(),
      detail: isRequired ? Joi.string().trim().required() : Joi.string().trim(),
      brand: isRequired ? Joi.string().trim().required() : Joi.string().trim(),
      code: isRequired ? Joi.string().trim().required() : Joi.string().trim(),
      category: isRequired
        ? Joi.string().trim().required()
        : Joi.string().trim(),
      price: isRequired
        ? Joi.number().positive().precision(2).required()
        : Joi.number().positive().precision(2),
      stock: isRequired
        ? Joi.number().integer().required()
        : Joi.number().integer(),
      thumbnail: isRequired
        ? Joi.string().trim().pattern(Product.urlPattern).required()
        : Joi.string().trim().pattern(Product.urlPattern)
    });
  }

  static validate(product, isRequired = true) {
    const ProductSchema = Product.getProductSchema(isRequired);
    const { error, value } = ProductSchema.validate(product);
    if (error) {
      logger.error(`Error de validación: ${error.message}`);
      return false;
    }
    return value;
  }
}
