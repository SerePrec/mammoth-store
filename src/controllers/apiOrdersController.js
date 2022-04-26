import ApiOrdersService from "../services/apiOrdersService.js";
import { logger } from "../logger/index.js";

class ApiOrdersController {
  constructor() {
    this.apiOrdersService = new ApiOrdersService();
  }

  getOrders = async (req, res) => {
    try {
      const ordersResume = await this.apiOrdersService.getOrdersResume();
      res.json(ordersResume);
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo recuperar la infomación"
      });
    }
  };

  getOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const order = await this.apiOrdersService.getOrder(id);
      order !== null
        ? res.json(order)
        : res.status(404).json({ error: "Orden no encontrada" });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo recuperar la infomación"
      });
    }
  };

  getUserOrders = async (req, res) => {
    try {
      const { user } = req;
      const userOrders = await this.apiOrdersService.getUserOrders(user);
      res.json(userOrders);
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo recuperar la infomación"
      });
    }
  };

  createOrder = async (req, res) => {
    try {
      const { user } = req;
      const data = req.body;
      const { result, id, number, username, newCartId } =
        await this.apiOrdersService.createOrder(user, data);
      if (result === "ok") {
        req.session ? (req.session.cartId = null) : null;
        logger.info(`Orden de usuario '${username}' creada con id ${id}`);
        res
          .status(201)
          .json({ result: "ok", orderId: id, orderNumber: number });
      } else {
        req.session ? (req.session.cartId = newCartId) : null;
        logger.info(
          `No se pudo crear la orden por contener items inválidos o desactualizados`
        );
        res.status(200).json({ result: "invalid", newCartId });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo crear la orden"
      });
    }
  };

  updateOrderStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const dataToUpdate = req.body;
      const updatedOrder = await this.apiOrdersService.updateOrderStatus(
        id,
        dataToUpdate
      );
      if (updatedOrder !== null) {
        logger.info(`Orden con id ${id} actualizada con éxito`);
        res.json({ result: "ok", updatedOrder });
      } else {
        logger.warn(`Orden con id ${id} no encontrada`);
        res.status(404).json({ error: "Orden no encontrada" });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo actualizar la orden"
      });
    }
  };
}

export default ApiOrdersController;
