import { Router } from "express";
import { isAuthWeb, isAdminWeb, isNotAdminWeb } from "../middlewares/auth.js";
import {
  getProducts,
  getProductsByCategory,
  getAdminProducts,
  getCart,
  getAdminCarts,
  getCheckout,
  getUsersChat,
  getAdminChat
} from "../controllers/webServerController.js";

const router = Router();

router.get("/", isAuthWeb, isNotAdminWeb, getProducts);

router.get("/productos/admin", isAuthWeb, isAdminWeb, getAdminProducts);

router.get("/categoria/:cat", isAuthWeb, isNotAdminWeb, getProductsByCategory);

router.get("/carrito", isAuthWeb, isNotAdminWeb, getCart);

router.get("/carritos/admin", isAuthWeb, isAdminWeb, getAdminCarts);

router.get("/checkout", getCheckout);

router.get("/chat/admin", isAuthWeb, isAdminWeb, getAdminChat);

router.get("/chat/:email?", isAuthWeb, isNotAdminWeb, getUsersChat);

export default router;
