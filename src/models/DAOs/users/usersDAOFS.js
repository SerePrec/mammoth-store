import BaseDAOFS from "../../baseDAOs/baseDAOFS.js";
import config from "../../../config.js";

class UsersDAOFS extends BaseDAOFS {
  constructor() {
    super(config.fileSystemDb.usersFile);
  }

  async getByUsername(username) {
    try {
      const users = await this.getAll();
      const match = users.find(user => user.username === username);
      return match ? match : null;
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario con username:'${username}': ${error}`
      );
    }
  }
}

export default UsersDAOFS;
