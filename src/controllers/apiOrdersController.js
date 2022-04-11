import ApiOrdersService from "../services/apiOrdersService.js";
import { logger } from "../logger/index.js";

class ApiOrdersController {
  constructor() {
    this.apiOrdersService = new ApiOrdersService();
  }

  // getOrders = async (req, res) => {};

  // getOrdersById = async (req, res) => {};

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
      const { id, number, username } = await this.apiOrdersService.createOrder(
        user,
        data
      );
      req.session ? (req.session.cartId = null) : null;
      logger.info(`Orden de usuario '${username}' creada con id ${id}`);
      res.status(201).json({ result: "ok", orderId: id, orderNumber: number });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        error: "No se pudo crear la orden"
      });
    }
  };
}

export default ApiOrdersController;
