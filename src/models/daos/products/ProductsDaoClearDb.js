import ContenedorSQL from "../../containers/ContenedorSQL.js";
import config from "../../../config.js";

class ProductsDaoClearDb extends ContenedorSQL {
  constructor() {
    super(config.clearDb, "products");
  }
}

export default ProductsDaoClearDb;
