import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import { UserDTO } from "../../DTOs/userDTO.js";
import config from "../../../config.js";
import { verifyTimestamp } from "../../../utils/dataTools.js";

class UsersDAOSQLite3 extends BaseDAOSQL {
  static #instance;

  constructor() {
    if (UsersDAOSQLite3.#instance) {
      return UsersDAOSQLite3.#instance;
    }
    super(config.sqlite3, "users", UserDTO);
    UsersDAOSQLite3.#instance = this;
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

export default UsersDAOSQLite3;
