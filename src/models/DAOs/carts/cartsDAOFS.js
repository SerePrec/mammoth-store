import BaseDAOFS from "../../baseDAOs/baseDAOFS.js";
import { CartDTO } from "../../DTOs/cartDTO.js";
import config from "../../../config.js";

class CartsDAOFS extends BaseDAOFS {
  static #instance;

  constructor() {
    if (CartsDAOFS.#instance) {
      return CartsDAOFS.#instance;
    }
    super(config.fileSystemDb.cartsFile, CartDTO);
    CartsDAOFS.#instance = this;
  }

  async save(cart = { products: [] }) {
    return super.save(cart);
  }

  //Obtengo un carrito por username
  async getByUsername(username) {
    try {
      const carts = await this.getAll();
      const match = carts.reverse().find(cart => cart.username === username);
      return match ? new this.DTO(match) : null;
    } catch (error) {
      throw new Error(
        `Error al obtener el carrito con username:'${username}': ${error}`
      );
    }
  }
}

export default CartsDAOFS;
