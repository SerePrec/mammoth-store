class ProductDTO {
  constructor(data) {
    this.title = data.title;
    this.detail = data.detail;
    this.code = data.code;
    this.brand = data.brand;
    this.category = data.category;
    this.price = data.price;
    this.stock = data.stock;
    this.thumbnail = data.thumbnail;

    data.id || data._id ? (this.id = data.id || data._id.toString()) : null;
    data.timestamp
      ? (this.timestamp =
          typeof data.timestamp === "object"
            ? data.timestamp.toISOString()
            : data.timestamp.toString())
      : null;
  }
}

// Se usa internamente en el cartsDAOSQL para comunicarse con el sub-DAO de la tabla "products_in_carts"
class SQLProductInCartDTO {
  constructor(data) {
    this.id_cart = data.id_cart;
    this.id = data.id;
    this.quantity = data.quantity;
    this.title = data.title;
    this.detail = data.detail;
    this.code = data.code;
    this.brand = data.brand;
    this.category = data.category;
    this.price = data.price;
    this.stock = data.stock;
    this.thumbnail = data.thumbnail;

    data.timestamp
      ? (this.timestamp =
          typeof data.timestamp === "object"
            ? data.timestamp.toISOString()
            : data.timestamp.toString())
      : null;
  }
}

// Se usa internamente en el ordersDAOSQL para comunicarse con el sub-DAO de la tabla "products_in_orders"
class SQLProductInOrderDTO {
  constructor(data) {
    this.id_order = data.id_order;
    this.id = data.id;
    this.quantity = data.quantity;
    this.title = data.title;
    this.detail = data.detail;
    this.code = data.code;
    this.brand = data.brand;
    this.category = data.category;
    this.price = data.price;
    this.stock = data.stock;
    this.thumbnail = data.thumbnail;

    data.timestamp
      ? (this.timestamp =
          typeof data.timestamp === "object"
            ? data.timestamp.toISOString()
            : data.timestamp.toString())
      : null;
  }
}

export { ProductDTO, SQLProductInCartDTO, SQLProductInOrderDTO };
