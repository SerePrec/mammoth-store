import CartsDaoSQL from "./CartsDaoSQL.js";
import config from "../../../config.js";

class CartsDaoSQLite3 extends CartsDaoSQL {
  constructor() {
    super(config.sqlite3);
  }
}

export default CartsDaoSQLite3;
