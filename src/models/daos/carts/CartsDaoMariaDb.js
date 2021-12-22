import CartsDaoSQL from "./CartsDaoSQL.js";
import config from "../../../config.js";

class CartsDaoMariaDb extends CartsDaoSQL {
  constructor() {
    super(config.mariaDb);
  }
}

export default CartsDaoMariaDb;
