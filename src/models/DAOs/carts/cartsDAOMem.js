import BaseDAOMem from "../../baseDAOs/baseDAOMem.js";
import { CartDTO } from "../../DTOs/cartDTO.js";

class CartsDAOMem extends BaseDAOMem {
  static #instance;

  constructor() {
    if (CartsDAOMem.#instance) {
      return CartsDAOMem.#instance;
    }
    super(CartDTO);
    CartsDAOMem.#instance = this;
  }

  save(cart = { products: [] }) {
    return super.save(cart);
  }

  //Obtengo un carrito por username
  getByUsername(username) {
    try {
      const match = this.elements
        .slice()
        .reverse()
        .find(cart => cart.username === username);
      return match ? new this.DTO(match) : null;
    } catch (error) {
      throw new Error(
        `Error al obtener el carrito con username:'${username}': ${error}`
      );
    }
  }
}

export default CartsDAOMem;
