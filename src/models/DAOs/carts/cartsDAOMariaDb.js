import CartsDAOSQL from "./cartsDAOSQL.js";
import { CartDTO } from "../../DTOs/cartDTO.js";
import config from "../../../config.js";

class CartsDAOMariaDb extends CartsDAOSQL {
  static #instance;

  constructor() {
    if (CartsDAOMariaDb.#instance) {
      return CartsDAOMariaDb.#instance;
    }
    super(config.mariaDb, CartDTO);
    CartsDAOMariaDb.#instance = this;
  }
}

export default CartsDAOMariaDb;
