import ApiCartsService from "../services/apiCartsService.js";
import { removeField } from "../utils/dataTools.js";
import { logger } from "../logger/index.js";

class ApiCartsController {
  constructor() {
    this.apiCartsService = new ApiCartsService();
  }

  getCarts = async (req, res) => {
    try {
      const cartsResume = await this.apiCartsService.getCartsResume();
      res.json(cartsResume);
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo recuperar la infomación"
      });
    }
  };

  getUserCart = async (req, res) => {
    try {
      const { user } = req;
      const userCart = await this.apiCartsService.getUserCart(user);
      if (userCart) {
        req.session ? (req.session.cartId = userCart.cartId) : null;
        res.json(userCart);
      } else {
        res.status(404).json({ error: "Carrito no encontrado" });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo recuperar la infomación"
      });
    }
  };

  getProductsFromCart = async (req, res) => {
    try {
      const { id } = req.params;
      const products = await this.apiCartsService.getProductsFromCart(id);
      products !== null
        ? res.json(products)
        : res.status(404).json({ error: "Carrito no encontrado" });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo recuperar la infomación"
      });
    }
  };

  createCart = async (req, res) => {
    try {
      const { user } = req;
      const { id, username } = await this.apiCartsService.createCart(user);
      req.session ? (req.session.cartId = id) : null;
      logger.debug(`Carrito de usuario '${username}' creado con id ${id}`);
      res.status(201).json({ result: "ok", cartId: id });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo crear el carrito"
      });
    }
  };

  addProductToCart = async (req, res) => {
    try {
      const { id } = req.params;
      const { id: id_prod, quantity } = req.body;
      const result = await this.apiCartsService.addProductToCart(
        id,
        id_prod,
        quantity
      );
      if (result && result.error) {
        const status = removeField(result, "status");
        return res.status(status).json(result);
      }
      logger.debug(
        `Producto con id ${id_prod} x${quantity}u añadido a carrito`
      );
      res.json({ result: "ok", addedProdId: id_prod, quantity });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: `No se pudo agregar el producto al carrito`
      });
    }
  };

  updateProductFromCart = async (req, res) => {
    try {
      const { id } = req.params;
      const { id: id_prod, quantity } = req.body;
      const result = await this.apiCartsService.updateProductFromCart(
        id,
        id_prod,
        quantity
      );
      if (result && result.error) {
        const status = removeField(result, "status");
        return res.status(status).json(result);
      }
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

  deleteCart = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedId = await this.apiCartsService.deleteCart(id);
      req.session ? (req.session.cartId = null) : null;
      if (deletedId !== null) {
        logger.debug(`Carrito con id ${req.params.id}} eliminado`);
        res.json({ result: "ok", deletedId });
      } else {
        res.status(404).json({ error: "Carrito no encontrado" });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo eliminar el carrito"
      });
    }
  };

  deleteProductFromCart = async (req, res) => {
    try {
      const { id, id_prod } = req.params;
      const result = await this.apiCartsService.deleteProductFromCart(
        id,
        id_prod
      );
      if (result && result.error) {
        const status = removeField(result, "status");
        return res.status(status).json(result);
      }
      logger.debug(`Producto con id ${id_prod} eliminado del carrito`);
      res.json({ result: "ok", deletedProdId: id_prod });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: `No se pudo eliminar el producto del carrito`
      });
    }
  };
}

export default ApiCartsController;
