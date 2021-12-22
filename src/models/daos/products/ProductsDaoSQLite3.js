import ContenedorSQL from "../../containers/ContenedorSQL.js";
import config from "../../../config.js";

class ProductsDaoSQLite3 extends ContenedorSQL {
  constructor() {
    super(config.sqlite3, "products");
  }
}

export default ProductsDaoSQLite3;
