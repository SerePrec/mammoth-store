import CartsDAOSQL from "./cartsDAOSQL.js";
import { CartDTO } from "../../DTOs/cartDTO.js";
import config from "../../../config.js";

class CartsDAOClearDb extends CartsDAOSQL {
  static #instance;

  constructor() {
    if (CartsDAOClearDb.#instance) {
      return CartsDAOClearDb.#instance;
    }
    super(config.clearDb, CartDTO);
    CartsDAOClearDb.#instance = this;
  }
}

export default CartsDAOClearDb;
