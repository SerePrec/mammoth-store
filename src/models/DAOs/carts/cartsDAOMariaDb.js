import CartsDAOSQL from "./cartsDAOSQL.js";
import config from "../../../config.js";

class CartsDAOMariaDb extends CartsDAOSQL {
  constructor() {
    super(config.mariaDb);
  }
}

export default CartsDAOMariaDb;
