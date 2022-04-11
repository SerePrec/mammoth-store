import { Router } from "express";
import { isUserCart, isAdminApi } from "../middlewares/auth.js";
import {
  validateId,
  validateIdId_prod,
  validateCartProductBody
} from "../middlewares/validateApiData.js";
import ApiCartsController from "../controllers/apiCartsController.js";

const router = Router();

class ApiCartsRouter {
  constructor() {
    this.apiCartsController = new ApiCartsController();
  }

  start() {
    router.get("/", isAdminApi, this.apiCartsController.getCarts);

    router.get("/usuario", this.apiCartsController.getUserCart);

    router.get(
      "/:id/productos",
      validateId,
      isUserCart,
      this.apiCartsController.getProductsFromCart
    );

    router.post("/", this.apiCartsController.createCart);

    router.post(
      "/:id/productos",
      validateId,
      isUserCart,
      validateCartProductBody,
      this.apiCartsController.addProductToCart
    );

    router.put(
      "/:id/productos",
      validateId,
      isUserCart,
      validateCartProductBody,
      this.apiCartsController.updateProductFromCart
    );

    router.delete(
      "/:id",
      validateId,
      isUserCart,
      this.apiCartsController.deleteCart
    );

    router.delete(
      "/:id/productos/:id_prod",
      validateIdId_prod,
      isUserCart,
      this.apiCartsController.deleteProductFromCart
    );

    return router;
  }
}

export default ApiCartsRouter;
