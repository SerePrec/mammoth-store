import BaseDAOMongoDB from "../../baseDAOs/baseDAOMongoDB.js";
import { UserDTO } from "../../DTOs/userDTO.js";
import { userSchema } from "../../schemas/userSchemaMongoDB.js";

class UsersDAOMongoDB extends BaseDAOMongoDB {
  static #instance;

  constructor() {
    if (UsersDAOMongoDB.#instance) {
      return UsersDAOMongoDB.#instance;
    }
    super("User", userSchema, UserDTO);
    UsersDAOMongoDB.#instance = this;
  }

  async getByUsername(username) {
    try {
      let user = await this.CollModel.findOne({ username }, { __v: 0 });
      return user ? new this.DTO(user) : null;
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario con username '${username}': ${error}`
      );
    }
  }
}

export default UsersDAOMongoDB;
