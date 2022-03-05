import { Router } from "express";
import { validateId, validateOrderPost } from "../middlewares/validateData.js";
import { isUserCart, isAdminApi } from "../middlewares/auth.js";
import { createOrder } from "../controllers/apiOrdersController.js";

const router = Router();

//router.get("/", isAdminApi, getCarts);

//router.get("/usuario", getUserCart);

router.post("/", isUserCart, validateOrderPost, createOrder);

//router.delete("/:id", validateId, isUserCart, deleteCart);

export default router;
