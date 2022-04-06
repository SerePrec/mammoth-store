import BaseDAOMem from "../../baseDAOs/baseDAOMem.js";
import { UserDTO } from "../../DTOs/userDTO.js";

class UsersDAOMem extends BaseDAOMem {
  static #instance;

  constructor() {
    if (UsersDAOMem.#instance) {
      return UsersDAOMem.#instance;
    }
    super(UserDTO);
    this.elements = [
      {
        id: 1,
        timestamp: "2022-02-26T21:23:26.082Z",
        username: "admin@mammoth.com",
        password:
          "$2b$10$UQMuNJPkJ7pNe37lNu10m.VZ8kMPy2x4fmOQAiPV6Chvj7U5HaD7y",
        name: "Sergio Emanuel Prellezo",
        address: "33 #922",
        age: 43,
        phone: "+5492215737971",
        avatar: "/img/avatars/admin_avatar.svg",
        role: "admin"
      }
    ];
    this.nextId = 2;

    UsersDAOMem.#instance = this;
  }

  getByUsername(username) {
    try {
      const match = this.elements.find(user => user.username === username);
      return match ? new this.DTO(match) : null;
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario con username:'${username}': ${error}`
      );
    }
  }
}

export default UsersDAOMem;
