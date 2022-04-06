import CartsDAOSQL from "./cartsDAOSQL.js";
import config from "../../../config.js";

class CartsDAOSQLite3 extends CartsDAOSQL {
  constructor() {
    super(config.sqlite3);
  }
}

export default CartsDAOSQLite3;
