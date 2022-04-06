import CartsDAOSQL from "./cartsDAOSQL.js";
import config from "../../../config.js";

class CartsDAOClearDb extends CartsDAOSQL {
  constructor() {
    super(config.clearDb);
  }
}

export default CartsDAOClearDb;
