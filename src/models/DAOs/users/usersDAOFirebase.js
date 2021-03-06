import BaseDAOFirebase from "../../baseDAOs/baseDAOFirebase.js";
import { UserDTO } from "../../DTOs/userDTO.js";

class UsersDAOFirebase extends BaseDAOFirebase {
  static #instance;

  constructor() {
    if (UsersDAOFirebase.#instance) {
      return UsersDAOFirebase.#instance;
    }
    super("users", UserDTO);
    UsersDAOFirebase.#instance = this;
  }

  async getByUsername(username) {
    try {
      const snapshot = await this.collection
        .where("username", "==", username)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      } else {
        let docs = [];
        snapshot.forEach(doc =>
          docs.push({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate()
          })
        );
        return new this.DTO(docs[0]);
      }
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario con username:'${username}': ${error}`
      );
    }
  }
}

export default UsersDAOFirebase;
