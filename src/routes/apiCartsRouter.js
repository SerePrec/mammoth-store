import { Router } from "express";
import {
  validateId,
  validateIdId_prod,
  validateCartProductBody
} from "../middlewares/validateData.js";
import { isUserCart, isAdminApi } from "../middlewares/auth.js";
import {
  getCarts,
  getUserCart,
  createCart,
  deleteCart,
  getProductsFromCart,
  addProductToCart,
  updateProductFromCart,
  deleteProductFromCart
} from "../controllers/apiCartsController.js";

const router = Router();

router.get("/", isAdminApi, getCarts);

router.get("/usuario", getUserCart);

router.get("/:id/productos", validateId, isUserCart, getProductsFromCart);

router.post("/", createCart);

router.post(
  "/:id/productos",
  validateId,
  isUserCart,
  validateCartProductBody,
  addProductToCart
);

router.put(
  "/:id/productos",
  validateId,
  isUserCart,
  validateCartProductBody,
  updateProductFromCart
);

router.delete("/:id", validateId, isUserCart, deleteCart);

router.delete(
  "/:id/productos/:id_prod",
  validateIdId_prod,
  isUserCart,
  deleteProductFromCart
);

export default router;
