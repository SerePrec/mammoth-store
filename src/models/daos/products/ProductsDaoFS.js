import ContenedorFS from "../../containers/ContenedorFS.js";
import config from "../../../config.js";

class ProductsDaoFS extends ContenedorFS {
  constructor() {
    super(config.fileSystemDb.productsFile);
  }
}

export default ProductsDaoFS;
