import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import config from "../../../config.js";
import { deepClone, verifyTimestamp } from "../../../utils/dataTools.js";

class UsersDAOSQLite3 extends BaseDAOSQL {
  constructor() {
    super(config.sqlite3, "users");
  }

  async getByUsername(username) {
    try {
      const [element] = await this.knex(this.table)
        .where({ username })
        .select("*");
      return element ? deepClone(verifyTimestamp(element)) : null;
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario con username '${username}': ${error}`
      );
    }
  }
}

export default UsersDAOSQLite3;
