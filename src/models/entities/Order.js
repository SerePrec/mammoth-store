import Joi from "joi";
import { Product } from "./Product.js";
import { User } from "./User.js";
import { logger } from "../../logger/index.js";

export class Order {
  constructor(
    username,
    name,
    address,
    cp,
    phone,
    products,
    total,
    status = "generada"
  ) {
    this.username = username;
    this.name = name;
    this.address = address;
    this.cp = cp;
    this.phone = phone;
    this.products = products;
    this.total = total;
    this.status = status;
  }

  static getOrderSchema(isRequired) {
    const ProductSchema = Product.getProductSchema(true);
    const DbStampsSchema = Joi.object({
      id: Joi.alternatives()
        .try(Joi.string().alphanum(), Joi.number().integer().positive())
        .required(),
      timestamp: Joi.date().iso().required()
    });
    const OrderProductSchema = ProductSchema.concat(DbStampsSchema);
    const OrderItemSchema = Joi.object({
      product: OrderProductSchema.required(),
      quantity: Joi.number().integer().positive().required()
    });
    return Order.getInputOrderSchema(isRequired).concat(
      Joi.object({
        username: isRequired
          ? Joi.string().trim().pattern(User.usernamePattern).required()
          : Joi.string().trim().pattern(User.usernamePattern),
        products: isRequired
          ? Joi.array().items(OrderItemSchema).required()
          : Joi.array().items(OrderItemSchema),
        total: isRequired
          ? Joi.number().positive().precision(2).required()
          : Joi.number().positive().precision(2),
        status: Joi.string().trim()
      })
    );
  }

  static getInputOrderSchema(isRequired) {
    return Joi.object({
      name: isRequired ? Joi.string().trim().required() : Joi.string().trim(),
      address: isRequired
        ? Joi.string().trim().required()
        : Joi.string().trim(),
      cp: isRequired
        ? Joi.string().alphanum().trim().required()
        : Joi.string().alphanum().trim(),
      phone: isRequired
        ? Joi.string().pattern(User.phonePattern).required()
        : Joi.string().pattern(User.phonePattern)
    });
  }

  static validate(order, isRequired = true) {
    const OrderSchema = Order.getOrderSchema(isRequired);
    const { error, value } = OrderSchema.validate(order);
    if (error) {
      logger.error(`Error de validación: ${error.message}`);
      return false;
    }
    return value;
  }

  static validateInput(InputOrderData, isRequired = true) {
    const InputOrderSchema = Order.getInputOrderSchema(isRequired);
    const { error, value } = InputOrderSchema.validate(InputOrderData);
    if (error) {
      logger.error(`Error de validación: ${error.message}`);
      return false;
    }
    return value;
  }
}
