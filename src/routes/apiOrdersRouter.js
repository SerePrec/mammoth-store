import { Router } from "express";
import { isUserCart, isAdminApi } from "../middlewares/auth.js";
import {
  validateId,
  validateOrderPost,
  validateOrderStatusPutBody
} from "../middlewares/validateApiData.js";
import ApiOrdersController from "../controllers/apiOrdersController.js";

const router = Router();

class ApiOrdersRouter {
  constructor() {
    this.apiOrdersController = new ApiOrdersController();
  }

  start() {
    router.get("/", isAdminApi, this.apiOrdersController.getOrders);

    router.get("/usuario", this.apiOrdersController.getUserOrders);

    router.get(
      "/:id",
      isAdminApi,
      validateId,
      this.apiOrdersController.getOrder
    );

    router.post(
      "/",
      isUserCart,
      validateOrderPost,
      this.apiOrdersController.createOrder
    );

    router.put(
      "/:id/estado",
      isAdminApi,
      validateId,
      validateOrderStatusPutBody,
      this.apiOrdersController.updateOrderStatus
    );

    return router;
  }
}

export default ApiOrdersRouter;
