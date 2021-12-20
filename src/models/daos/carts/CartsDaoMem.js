import ContenedorMem from "../../containers/ContenedorMem.js";

class CartsDaoMem extends ContenedorMem {
  save(cart = { products: [] }) {
    return super.save(cart);
  }
}

export default CartsDaoMem;
