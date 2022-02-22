import { Router } from "express";
import { isAdmin } from "../middlewares/auth.js";
import {
  getProducts,
  getAdminProducts,
  getCart,
  getAdminCarts,
  getUsersChat,
  getAdminChat
} from "../controllers/webServerController.js";

const router = Router();

router.get("/productos", getProducts);

router.get("/productos/admin", isAdmin, getAdminProducts);

router.get("/carrito", getCart);

router.get("/carritos/admin", isAdmin, getAdminCarts);

router.get("/chat/admin", isAdmin, getAdminChat);

router.get("/chat/:email?", getUsersChat);

export default router;
