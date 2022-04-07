import CartsDAOSQL from "./cartsDAOSQL.js";
import { CartDTO } from "../../DTOs/cartDTO.js";
import config from "../../../config.js";

class CartsDAOSQLite3 extends CartsDAOSQL {
  static #instance;

  constructor() {
    if (CartsDAOSQLite3.#instance) {
      return CartsDAOSQLite3.#instance;
    }
    super(config.sqlite3, CartDTO);
    CartsDAOSQLite3.#instance = this;
  }
}

export default CartsDAOSQLite3;
