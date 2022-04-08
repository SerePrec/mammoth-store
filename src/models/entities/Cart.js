import Joi from "joi";
import { Product } from "./Product.js";
import { User } from "./User.js";
import { logger } from "../../logger/index.js";

export class Cart {
  constructor(username, products) {
    this.username = username;
    this.products = products;
  }

  static getCartSchema(isRequired) {
    const ProductSchema = Product.getProductSchema(true);
    const DbStampsSchema = Joi.object({
      id: Joi.alternatives()
        .try(Joi.string().alphanum(), Joi.number().integer().positive())
        .required(),
      timestamp: Joi.date().iso().required()
    });
    const CartProductSchema = ProductSchema.concat(DbStampsSchema);
    const CartItemSchema = Joi.object({
      product: CartProductSchema.required(),
      quantity: Joi.number().integer().positive().required()
    });
    return Joi.object({
      username: isRequired
        ? Joi.string().trim().pattern(User.usernamePattern).required()
        : Joi.string().trim().pattern(User.usernamePattern),
      products: isRequired
        ? Joi.array().items(CartItemSchema).required()
        : Joi.array().items(CartItemSchema)
    });
  }

  static validate(cart, isRequired = true) {
    const CartSchema = Cart.getCartSchema(isRequired);
    const { error, value } = CartSchema.validate(cart);
    if (error) {
      logger.error(`Error de validación: ${error.message}`);
      return false;
    }
    return value;
  }
}
