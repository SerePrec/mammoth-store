import ContenedorFirebase from "../../containers/ContenedorFirebase.js";

class CartsDaoFirebase extends ContenedorFirebase {
  constructor() {
    super("carts");
  }
  async save(cart = { products: [] }) {
    return super.save(cart);
  }
}

export default CartsDaoFirebase;
