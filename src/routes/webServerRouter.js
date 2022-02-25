import { Router } from "express";
import { isAuthWeb, isAdmin } from "../middlewares/auth.js";
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

router.get("/", isAuthWeb, getProducts);

router.get("/productos/admin", isAuthWeb, isAdmin, getAdminProducts);

router.get("/categoria/:cat", isAuthWeb, getProductsByCategory);

router.get("/carrito", isAuthWeb, getCart);

router.get("/carritos/admin", isAuthWeb, isAdmin, getAdminCarts);

router.get("/checkout", getCheckout);

router.get("/chat/admin", isAuthWeb, isAdmin, getAdminChat);

router.get("/chat/:email?", isAuthWeb, getUsersChat);

export default router;
