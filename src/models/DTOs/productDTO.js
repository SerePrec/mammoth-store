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

export { ProductDTO };
