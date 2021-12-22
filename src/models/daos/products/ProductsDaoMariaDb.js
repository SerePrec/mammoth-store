import ContenedorSQL from "../../containers/ContenedorSQL.js";
import config from "../../../config.js";

class ProductsDaoMariaDb extends ContenedorSQL {
  constructor() {
    super(config.mariaDb, "products");
  }
}

export default ProductsDaoMariaDb;
