import { Router } from "express";
import { validateOrderPost } from "../middlewares/validateData.js";
import { isUserCart, isAdminApi } from "../middlewares/auth.js";
import {
  createOrder,
  getUserOrders
} from "../controllers/apiOrdersController.js";

const router = Router();

// TODO:
//router.get("/", isAdminApi, getOrders);

//router.get("/", isAdminApi, getOrderByNumber);

router.get("/usuario", getUserOrders);

router.post("/", isUserCart, validateOrderPost, createOrder);

export default router;
