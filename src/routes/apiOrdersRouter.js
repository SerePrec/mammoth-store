import { Router } from "express";
import { isUserCart, isAdminApi } from "../middlewares/auth.js";
import { validateOrderPost } from "../middlewares/validateApiData.js";
import ApiOrdersController from "../controllers/apiOrdersController.js";

const router = Router();

class ApiOrdersRouter {
  constructor() {
    this.apiOrdersController = new ApiOrdersController();
  }

  start() {
    //router.get("/", isAdminApi, getOrders);

    //router.get("/:id", isAdminApi, getOrderById);

    router.get("/usuario", this.apiOrdersController.getUserOrders);

    router.post(
      "/",
      isUserCart,
      validateOrderPost,
      this.apiOrdersController.createOrder
    );

    return router;
  }
}

export default ApiOrdersRouter;
