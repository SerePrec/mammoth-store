import ContenedorMem from "../../containers/ContenedorMem.js";

class CartsDaoMem extends ContenedorMem {
  save(cart = { products: [] }) {
    return super.save(cart);
  }

  //Obtengo un carrito por username
  getByUsername(username) {
    const match = this.elements
      .slice()
      .reverse()
      .find(cart => cart.username === username);
    return match ? match : null;
  }
}

export default CartsDaoMem;
