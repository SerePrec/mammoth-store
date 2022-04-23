import { Router } from "express";
import { isAuthWeb, isAdminWeb, isNotAdminWeb } from "../middlewares/auth.js";
import WebServerController from "../controllers/webServerController.js";

const router = Router();

class WebServerRouter {
  constructor() {
    this.webServerController = new WebServerController();
  }

  start() {
    router.get(
      "/",
      isAuthWeb,
      isNotAdminWeb,
      this.webServerController.getProducts
    );

    router.get(
      "/producto/:id",
      isAuthWeb,
      isNotAdminWeb,
      this.webServerController.getProductDetail
    );

    router.get(
      "/productos/admin",
      isAuthWeb,
      isAdminWeb,
      this.webServerController.getAdminProducts
    );

    router.get(
      "/categoria/:cat",
      isAuthWeb,
      isNotAdminWeb,
      this.webServerController.getProductsByCategory
    );

    router.get(
      "/carrito",
      isAuthWeb,
      isNotAdminWeb,
      this.webServerController.getCart
    );

    router.get(
      "/carritos/admin",
      isAuthWeb,
      isAdminWeb,
      this.webServerController.getAdminCarts
    );

    router.get(
      "/micuenta",
      isAuthWeb,
      isNotAdminWeb,
      this.webServerController.getMyAccount
    );

    router.get(
      "/chat/admin",
      isAuthWeb,
      isAdminWeb,
      this.webServerController.getAdminChat
    );

    router.get(
      "/chat/:email?",
      isAuthWeb,
      isNotAdminWeb,
      this.webServerController.getUsersChat
    );

    router.get(
      "/checkout",
      isAuthWeb,
      isNotAdminWeb,
      this.webServerController.getCheckout
    );

    router.get(
      "/checkout/ok",
      isAuthWeb,
      isNotAdminWeb,
      this.webServerController.getCheckoutOk
    );

    router.get(
      "/checkout/error",
      isAuthWeb,
      isNotAdminWeb,
      this.webServerController.getCheckoutError
    );

    router.get(
      "/server-config",
      isAuthWeb,
      isAdminWeb,
      this.webServerController.getServerConfig
    );

    return router;
  }
}

export default WebServerRouter;
