import { deepClone } from "../../utils/dataTools.js";

class CartDTO {
  constructor(data) {
    this.username = data.username;
    this.products =
      data.products !== undefined ? deepClone(data.products) : undefined;

    data.id || data._id ? (this.id = data.id || data._id.toString()) : null;
    data.timestamp
      ? (this.timestamp =
          typeof data.timestamp === "object"
            ? data.timestamp.toISOString()
            : data.timestamp.toString())
      : null;
  }
}

// Se usa internamente en el cartsDAOSQL para comunicarse con el sub-DAO de la tabla "carts"
class SQLCartDTO {
  constructor(data) {
    this.username = data.username;

    data.id ? (this.id = data.id) : null;
    data.timestamp
      ? (this.timestamp =
          typeof data.timestamp === "object"
            ? data.timestamp.toISOString()
            : data.timestamp.toString())
      : null;
  }
}

export { CartDTO, SQLCartDTO };
