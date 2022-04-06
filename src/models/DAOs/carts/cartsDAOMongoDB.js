import BaseDAOMongoDB from "../../baseDAOs/baseDAOMongoDB.js";
import { cartSchema } from "../../schemas/cartSchemaMongoDB.js";
import { CartDTO } from "../../DTOs/cartDTO.js";
class CartsDAOMongoDB extends BaseDAOMongoDB {
  static #instance;

  constructor() {
    if (CartsDAOMongoDB.#instance) {
      return CartsDAOMongoDB.#instance;
    }
    super("Cart", cartSchema, CartDTO);
    CartsDAOMongoDB.#instance = this;
  }

  async save(cart = { products: [] }) {
    return super.save(cart);
  }

  //Obtengo un carrito por username
  async getByUsername(username) {
    try {
      let userCart = await this.CollModel.findOne({ username }, { __v: 0 });
      return userCart ? new this.DTO(userCart) : null;
    } catch (error) {
      throw new Error(
        `Error al obtener el carrito con username '${username}': ${error}`
      );
    }
  }
}

export default CartsDAOMongoDB;
