import ApiProductsService from "../services/apiProductsService.js";
import { logger } from "../logger/index.js";

class ApiProductsController {
  constructor() {
    this.apiProductsService = new ApiProductsService();
  }

  getAllProducts = async (req, res, next) => {
    if (req.params.id !== undefined) return next();
    try {
      const products = await this.apiProductsService.getAllProducts();
      res.json(products);
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo recuperar la infomación"
      });
    }
  };

  getProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await this.apiProductsService.getProduct(id);
      product !== null
        ? res.json(product)
        : res.status(404).json({ error: "Producto no encontrado" });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo recuperar la infomación"
      });
    }
  };

  createProduct = async (req, res) => {
    try {
      const newProductData = req.body;
      const newProduct = await this.apiProductsService.createProduct(
        newProductData
      );
      logger.info(`Producto creado con éxito con id ${newProduct.id}`);
      res.status(201).json({ result: "ok", newProduct });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo agregar el producto"
      });
    }
  };

  updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const dataToUpdate = req.body;
      const updatedProduct = await this.apiProductsService.updateProduct(
        id,
        dataToUpdate
      );
      if (updatedProduct !== null) {
        logger.info(`Producto con id ${id} actualizado con éxito`);
        res.json({ result: "ok", updatedProduct });
      } else {
        logger.warn(`Producto con id ${id} no encontrado`);
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo actualizar el producto"
      });
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedId = await this.apiProductsService.deleteProduct(id);
      if (deletedId !== null) {
        logger.info(`Producto con id ${req.params.id} borrado con éxito`);
        res.json({ result: "ok", deletedId });
      } else {
        logger.warn(`Producto con id ${req.params.id} no encontrado`);
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo eliminar el producto"
      });
    }
  };
}

export default ApiProductsController;
