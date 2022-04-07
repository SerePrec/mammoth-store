import BaseDAOSQL from "../../baseDAOs/baseDAOSQL.js";
import { removeField } from "../../../utils/dataTools.js";
import { SQLCartDTO } from "../../DTOs/cartDTO.js";
import { SQLProductInCartDTO } from "../../DTOs/productDTO.js";
import { logger } from "../../../logger/index.js";

class CartsDAOSQL {
  constructor(config, DTO) {
    this.carts = new BaseDAOSQL(config, "carts", SQLCartDTO);
    this.productsInCarts = new BaseDAOSQL(
      config,
      "products_in_carts",
      SQLProductInCartDTO
    );
    this.DTO = DTO;
  }

  //No tiene funcionalidad pero es para mantener las mismas interfaces
  async init() {}

  //Guardo el carrito
  async save(cart = {}) {
    try {
      // El manejo del id y el timestamp se maneja internamente desde base de datos
      const { username } = cart;
      const cartData = { username };
      const newCart = await this.carts.save(new SQLCartDTO(cartData));
      logger.debug("Carrito guardado con éxito");
      newCart.products = [];
      return new this.DTO(newCart);
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
      return Object.values(cartsDic).map(cart => new this.DTO(cart));
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
        return new this.DTO(cart);
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Error al obtener el carrito con id '${id_cart}': ${error}`
      );
    }
  }

  //Obtengo un carrito por username
  async getByUsername(username) {
    try {
      const [cartData] = await this.carts.getAll({ username });
      if (cartData) {
        const id_cart = cartData.id;
        const productsInCart = await this.productsInCarts.getAll({ id_cart });
        const cart = { ...cartData, products: [] };
        productsInCart.forEach(product => {
          const quantity = removeField(product, "quantity");
          removeField(product, "id_cart");
          const cartItem = { product, quantity };
          cart.products.push(cartItem);
        });
        return new this.DTO(cart);
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Error al obtener el carrito con username '${username}': ${error}`
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
        dataToSave.push(new SQLProductInCartDTO(productInCart));
      }
      // utilizo la funcionalidad dual de éste método DAOSQL para pasar array
      // en lugar de iterar por cada elemento y guardar individual
      dataToSave.length > 0 && (await this.productsInCarts.save(dataToSave));
      const updateCart = await this.getById(id_cart);
      logger.debug(`El carrito con id: ${id_cart} se actualizó con éxito`);
      // ya viene como DTO
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
      logger.debug("Todos los carritos borrados con éxito");
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
        logger.debug(`El carrito con id: ${id_cart} se eliminó con éxito`);
        return id_cart;
      } else {
        logger.debug(`No se encontró el carrito con el id: ${id_cart}`);
        return null;
      }
    } catch (error) {
      throw new Error(
        `Error al borrar el carrito con id '${id_cart}': ${error}`
      );
    }
  }
}

export default CartsDAOSQL;
