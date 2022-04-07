import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import { UserDTO } from "../../DTOs/userDTO.js";
import config from "../../../config.js";
import { verifyTimestamp } from "../../../utils/dataTools.js";

class UsersDAOMariaDb extends BaseDAOSQL {
  static #instance;

  constructor() {
    if (UsersDAOMariaDb.#instance) {
      return UsersDAOMariaDb.#instance;
    }
    super(config.mariaDb, "users", UserDTO);
    UsersDAOMariaDb.#instance = this;
  }

  async getByUsername(username) {
    try {
      const [element] = await this.knex(this.table)
        .where({ username })
        .select("*");
      return element ? new this.DTO(verifyTimestamp(element)) : null;
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario con username '${username}': ${error}`
      );
    }
  }
}

export default UsersDAOMariaDb;
