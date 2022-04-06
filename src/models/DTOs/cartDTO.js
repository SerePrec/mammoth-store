import { deepClone } from "../../utils/dataTools.js";

class CartDTO {
  constructor(data) {
    this.username = data.username;
    this.products = deepClone(data.products);

    data.id || data._id ? (this.id = data.id || data._id.toString()) : null;
    data.timestamp
      ? (this.timestamp =
          typeof data.timestamp === "object"
            ? data.timestamp.toISOString()
            : data.timestamp.toString())
      : null;
  }
}

class CartUpdateDTO {
  constructor(data) {
    this.products = deepClone(data.products);
  }
}

export { CartDTO, CartUpdateDTO };
