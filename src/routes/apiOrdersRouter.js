import { Router } from "express";
import { validateId, validateOrderPost } from "../middlewares/validateData.js";
import { isUserCart, isAdminApi } from "../middlewares/auth.js";
import {
  createOrder,
  getUserOrders
} from "../controllers/apiOrdersController.js";

const router = Router();

//router.get("/", isAdminApi, getCarts);

router.get("/usuario", getUserOrders);

router.post("/", isUserCart, validateOrderPost, createOrder);

export default router;
