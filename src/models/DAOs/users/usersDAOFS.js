import BaseDAOFS from "../../baseDAOs/baseDAOFS.js";
import { UserDTO } from "../../DTOs/userDTO.js";
import config from "../../../config.js";

class UsersDAOFS extends BaseDAOFS {
  static #instance;

  constructor() {
    if (UsersDAOFS.#instance) {
      return UsersDAOFS.#instance;
    }
    super(config.fileSystemDb.usersFile, UserDTO);
    UsersDAOFS.#instance = this;
  }

  async getByUsername(username) {
    try {
      const users = await this.getAll();
      const match = users.find(user => user.username === username);
      return match ? new this.DTO(match) : null;
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario con username:'${username}': ${error}`
      );
    }
  }
}

export default UsersDAOFS;
