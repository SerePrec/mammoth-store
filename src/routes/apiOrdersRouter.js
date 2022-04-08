import { Router } from "express";
import { validateOrderPost } from "../middlewares/validateApiData.js";
import { isUserCart, isAdminApi } from "../middlewares/auth.js";
import {
  createOrder,
  getUserOrders
} from "../controllers/apiOrdersController.js";

const router = Router();

// TODO:
//router.get("/", isAdminApi, getOrders);

//router.get("/:id", isAdminApi, getOrderById);

router.get("/usuario", getUserOrders);

router.post("/", isUserCart, validateOrderPost, createOrder);

export default router;
