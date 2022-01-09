import ContenedorSQL from "../../containers/ContenedorSQL.js";
import { removeField } from "../../../utils/dataTools.js";

class CartsDaoSQL {
  constructor(config) {
    this.carts = new ContenedorSQL(config, "carts");
    this.productsInCarts = new ContenedorSQL(config, "products_in_carts");
  }

  //Guardo el carrito
  async save(cart = {}) {
    try {
      // El manejo del id y el timestamp se maneja internamente desde base de datos
      const newCart = await this.carts.save(cart);
      console.log("Carrito guardado con éxito");
      newCart.products = [];
      return newCart;
    } catch (error) {
      throw new Error(`Error al guardar el carrito: ${error}`);
    }
  }

  //Obtengo todos los carritos
  async getAll() {
    try {
      const [cartsPromise, productsPromise] = await Promise.allSettled([
        this.carts.getAll(),
        this.productsInCarts.getAll()
      ]);
      if (
        cartsPromise.status === "rejected" ||
        productsPromise.status === "rejected"
      )
        throw new Error("No se pudo acceder completamente a la información");
      const cartsData = cartsPromise.value;
      const productsInCarts = productsPromise.value;
      const cartsDic = {};
      cartsData.forEach(
        cartData => (cartsDic[cartData.id] = { ...cartData, products: [] })
      );
      productsInCarts.forEach(product => {
        const idCart = removeField(product, "id_cart");
        const quantity = removeField(product, "quantity");
        const cartItem = { product, quantity };
        cartsDic[idCart].products.push(cartItem);
      });
      return Object.values(cartsDic);
    } catch (error) {
      throw new Error(`No se pudo recuperar los carritos: ${error}`);
    }
  }

  //Obtengo un carrito por su id
  async getById(id_cart) {
    try {
      id_cart = parseInt(id_cart);
      const [cartPromise, productsPromise] = await Promise.allSettled([
        this.carts.getById(id_cart),
        this.productsInCarts.getAll({ id_cart })
      ]);
      if (
        cartPromise.status === "rejected" ||
        productsPromise.status === "rejected"
      )
        throw new Error("No se pudo acceder completamente a la información");
      const cartData = cartPromise.value;
      const productsInCart = productsPromise.value;
      if (cartData) {
        const cart = { ...cartData, products: [] };
        productsInCart.forEach(product => {
          const quantity = removeField(product, "quantity");
          removeField(product, "id_cart");
          const cartItem = { product, quantity };
          cart.products.push(cartItem);
        });
        return cart;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Error al obtener el carrito con id '${id_cart}': ${error}`
      );
    }
  }

  //actualizo un carrito por su id
  async updateById(id_cart, { products }) {
    try {
      id_cart = parseInt(id_cart);
      await this.productsInCarts.deleteAll({ id_cart });
      const dataToSave = [];
      for (const prod of products) {
        removeField(prod.product, "timestamp");
        const productInCart = {
          id_cart,
          ...prod.product,
          quantity: prod.quantity
        };
        dataToSave.push(productInCart);
      }
      dataToSave.length > 0 && (await this.productsInCarts.save(dataToSave));
      const updateCart = await this.getById(id_cart);
      console.log(`El carrito con id: ${id_cart} se actualizó con éxito`);
      return updateCart;
    } catch (error) {
      throw new Error(
        `Error al actualizar el carrito con id '${id_cart}': ${error}`
      );
    }
  }

  //borro todos los carritos
  async deleteAll() {
    try {
      const [cartPromise, productsPromise] = await Promise.allSettled([
        this.carts.deleteAll(),
        this.productsInCarts.deleteAll()
      ]);
      if (
        cartPromise.status === "rejected" ||
        productsPromise.status === "rejected"
      )
        throw new Error("No se pudo borrar completamente la información");
      console.log("Todos los carritos borrados con éxito");
      return true;
    } catch (error) {
      throw new Error(`Error al borrar todos los carritos: ${error}`);
    }
  }

  //borro un carrito por su id
  async deleteById(id_cart) {
    try {
      id_cart = parseInt(id_cart);
      const [cartPromise, productsPromise] = await Promise.allSettled([
        this.carts.deleteById(id_cart),
        this.productsInCarts.deleteAll({ id_cart })
      ]);
      if (
        cartPromise.status === "rejected" ||
        productsPromise.status === "rejected"
      )
        throw new Error("No se pudo borrar completamente la información");
      const cartData = cartPromise.value;
      if (cartData) {
        console.log(`El carrito con id: ${id_cart} se eliminó con éxito`);
        return id_cart;
      } else {
        console.log(`No se encontró el carrito con el id: ${id_cart}`);
        return null;
      }
    } catch (error) {
      throw new Error(
        `Error al borrar el carrito con id '${id_cart}': ${error}`
      );
    }
  }
}

export default CartsDaoSQL;
