import { Router } from "express";
import { isAuthWeb, isAdminWeb, isNotAdminWeb } from "../middlewares/auth.js";
import {
  getProducts,
  getProductDetail,
  getProductsByCategory,
  getAdminProducts,
  getCart,
  getAdminCarts,
  getMyAccount,
  getUsersChat,
  getAdminChat,
  getCheckout,
  getCheckoutOk,
  getCheckoutError
} from "../controllers/webServerController.js";

const router = Router();

router.get("/", isAuthWeb, isNotAdminWeb, getProducts);

router.get("/producto/:id", isAuthWeb, isNotAdminWeb, getProductDetail);

router.get("/productos/admin", isAuthWeb, isAdminWeb, getAdminProducts);

router.get("/categoria/:cat", isAuthWeb, isNotAdminWeb, getProductsByCategory);

router.get("/carrito", isAuthWeb, isNotAdminWeb, getCart);

router.get("/carritos/admin", isAuthWeb, isAdminWeb, getAdminCarts);

router.get("/micuenta", isAuthWeb, isNotAdminWeb, getMyAccount);

router.get("/chat/admin", isAuthWeb, isAdminWeb, getAdminChat);

router.get("/chat/:email?", isAuthWeb, isNotAdminWeb, getUsersChat);

router.get("/checkout", isAuthWeb, isNotAdminWeb, getCheckout);

router.get("/checkout/ok", isAuthWeb, isNotAdminWeb, getCheckoutOk);

router.get("/checkout/error", isAuthWeb, isNotAdminWeb, getCheckoutError);

export default router;
