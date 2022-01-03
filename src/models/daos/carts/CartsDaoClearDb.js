import CartsDaoSQL from "./CartsDaoSQL.js";
import config from "../../../config.js";

class CartsDaoClearDb extends CartsDaoSQL {
  constructor() {
    super(config.clearDb);
  }
}

export default CartsDaoClearDb;
