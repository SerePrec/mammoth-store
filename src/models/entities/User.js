import Joi from "joi";
import { logger } from "../../logger/index.js";

export class User {
  constructor(
    username,
    password,
    name,
    address,
    age,
    phone,
    avatar,
    role = "user"
  ) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.address = address;
    this.age = age;
    this.phone = phone;
    this.avatar = avatar;
    this.role = role;
  }

  static usernamePattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  static phonePattern = /^[+][0-9]{8,20}$/;

  static getUserSchema(isRequired) {
    return Joi.object({
      username: isRequired
        ? Joi.string().trim().pattern(User.usernamePattern).required()
        : Joi.string().trim().pattern(User.usernamePattern),
      password: isRequired
        ? Joi.string().min(8).required()
        : Joi.string().min(8),
      name: isRequired ? Joi.string().trim().required() : Joi.string().trim(),
      address: isRequired
        ? Joi.string().trim().required()
        : Joi.string().trim(),
      age: isRequired
        ? Joi.number().integer().min(18).max(120).required()
        : Joi.number().integer().min(18).max(120),
      phone: isRequired
        ? Joi.string().pattern(User.phonePattern).required()
        : Joi.string().pattern(User.phonePattern),
      avatar: isRequired ? Joi.string().trim().required() : Joi.string().trim(),
      role: Joi.string().trim()
    });
  }

  static validate(user, isRequired = true) {
    const UserSchema = User.getUserSchema(isRequired);
    const { error, value } = UserSchema.validate(user);
    if (error) {
      logger.error(`Error de validación: ${error.message}`);
      return false;
    }
    return value;
  }
}
