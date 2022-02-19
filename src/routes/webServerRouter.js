import { Router } from "express";
import { isAdmin } from "../middlewares/auth.js";
import {
  getProducts,
  getCarts,
  getUsersChat,
  getAdminChat
} from "../controllers/webServerController.js";

const router = Router();

router.get("/productos", isAdmin, getProducts);

router.get("/carritos", getCarts);

router.get("/chat/:email?", getUsersChat);

router.get("/chat-admin", isAdmin, getAdminChat);

export default router;
