import { deepClone } from "../../utils/dataTools.js";

class OrderDTO {
  constructor(data) {
    this.username = data.username;
    this.name = data.name;
    this.address = data.address;
    this.phone = data.phone;
    this.cp = data.cp;
    this.products =
      data.products !== undefined ? deepClone(data.products) : undefined;
    this.total = data.total;
    this.status = data.status;
    this.number = data.number;

    data.number ? (this.number = data.number) : null;
    data.id || data._id ? (this.id = data.id || data._id.toString()) : null;
    data.timestamp
      ? (this.timestamp =
          typeof data.timestamp === "object"
            ? data.timestamp.toISOString()
            : data.timestamp.toString())
      : null;
  }
}

// Se usa internamente en el ordersDAOSQL para comunicarse con el sub-DAO de la tabla "orders"
class SQLOrderDTO {
  constructor(data) {
    this.username = data.username;
    this.name = data.name;
    this.address = data.address;
    this.phone = data.phone;
    this.cp = data.cp;
    this.total = data.total;
    this.status = data.status;
    this.number = data.number;

    data.id ? (this.id = data.id) : null;
    data.timestamp
      ? (this.timestamp =
          typeof data.timestamp === "object"
            ? data.timestamp.toISOString()
            : data.timestamp.toString())
      : null;
  }
}

export { OrderDTO, SQLOrderDTO };
