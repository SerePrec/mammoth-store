import { cartsModel, productsModel } from "../models/index.js";
import { logger } from "../logger/index.js";

import { CartDTO } from "../models/DTOs/cartDTO.js"; //FIXME:

export const getCarts = async (req, res) => {
  try {
    const cartsIds = (await cartsModel.getAll()).map(cart => ({
      cartId: cart.id,
      cartUser: cart.username,
      timestamp: cart.timestamp
    }));
    res.json(cartsIds);
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: "No se pudo recuperar la infomación"
    });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const { user } = req;
    const username = user.provider ? user.emails[0].value : user.username;
    const userCart = await cartsModel.getByUsername(username);
    if (userCart) {
      req.session ? (req.session.cartId = userCart.id) : null;
      res.json({ cartId: userCart.id, products: userCart.products });
    } else {
      res.json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: "No se pudo recuperar la infomación"
    });
  }
};

export const getProductsFromCart = async (req, res) => {
  try {
    const cart = await cartsModel.getById(req.params.id);
    cart !== null
      ? res.json(cart.products)
      : res.json({ error: "Carrito no encontrado" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: "No se pudo recuperar la infomación"
    });
  }
};

export const createCart = async (req, res) => {
  try {
    const { user } = req;
    const username = user.provider ? user.emails[0].value : user.username;
    const cart = { username, products: [] };
    const { id } = await cartsModel.save(cart);
    req.session ? (req.session.cartId = id) : null;
    logger.debug(`Carrito de usuario '${username}' creado con id ${id}`);
    res.json({ result: "ok", cartId: id });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: "No se pudo crear el carrito"
    });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: id_prod, quantity } = req.body;
    const cart = await cartsModel.getById(id);
    if (cart === null) return res.json({ error: "Carrito no encontrado" });
    const product = await productsModel.getById(id_prod);
    if (product === null) return res.json({ error: "Producto no encontrado" });
    const { products } = cart;
    let index = products.findIndex(item => item.product.id == id_prod);
    const { stock } = product;
    if (index === -1 && quantity <= stock) {
      products.push({ product, quantity });
    } else if (index !== -1 && products[index].quantity + quantity <= stock) {
      products[index].product = product; //TODO:actualiza posible cambio de precio, etc
      products[index].quantity += quantity;
    } else {
      return res.json({
        error: "La cantidad total agregada no puede superar al stock",
        stock
      });
    }
    await cartsModel.updateById(id, new CartDTO({ products })); //FIXME: tema CartUpdateDTO
    logger.debug(`Producto con id ${id_prod} x${quantity}u añadido a carrito`);
    res.json({ result: "ok", addedProdId: id_prod, quantity });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: `No se pudo agregar el producto al carrito`
    });
  }
};

export const updateProductFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: id_prod, quantity } = req.body;
    const cart = await cartsModel.getById(id);
    if (cart === null) return res.json({ error: "Carrito no encontrado" });
    const { products } = cart;
    let index = products.findIndex(item => item.product.id == id_prod);
    if (index === -1) {
      return res.json({ error: "Producto no encontrado" });
    } else {
      const product = await productsModel.getById(id_prod);
      const { stock } = product;
      if (quantity > stock)
        return res.json({
          error: "La cantidad no puede superar al stock",
          stock
        });
      products[index].product = product; //TODO: actualiza posible cambio de precio, etc
      products[index].quantity = quantity;
    }
    await cartsModel.updateById(id, { products });
    logger.debug(
      `Producto con id ${id_prod} x${quantity}u actualizado en carrito`
    );
    res.json({ result: "ok", updatedProdId: id_prod, quantity });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: `No se pudo modificar la cantidad del producto en el carrito`
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const deletedId = await cartsModel.deleteById(req.params.id);
    req.session ? (req.session.cartId = null) : null;
    if (deletedId !== null) {
      logger.debug(`Carrito con id ${req.params.id}} eliminado`);
      res.json({ result: "ok", deletedId });
    } else {
      res.json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: "No se pudo eliminar el carrito"
    });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { id, id_prod } = req.params;
    const cart = await cartsModel.getById(id);
    if (cart === null) return res.json({ error: "Carrito no encontrado" });
    const { products } = cart;
    let index = products.findIndex(item => item.product.id == id_prod);
    if (index === -1) {
      return res.json({ error: "Producto no encontrado" });
    } else {
      products.splice(index, 1);
    }
    await cartsModel.updateById(id, { products });
    logger.debug(`Producto con id ${id_prod} eliminado del carrito`);
    res.json({ result: "ok", deletedProdId: id_prod });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: `No se pudo eliminar el producto del carrito`
    });
  }
};
