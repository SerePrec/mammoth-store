import { Router } from "express";
import {
  validateId,
  validateIdId_prod,
  validateCartProductBody
} from "../middlewares/validateData.js";
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

router.get("/", getCarts);

router.get("/usuario", getUserCart);

router.get("/:id/productos", validateId, getProductsFromCart);

router.post("/", createCart);

router.post(
  "/:id/productos",
  validateId,
  validateCartProductBody,
  addProductToCart
);

router.put(
  "/:id/productos",
  validateId,
  validateCartProductBody,
  updateProductFromCart
);

router.delete("/:id", validateId, deleteCart);

router.delete(
  "/:id/productos/:id_prod",
  validateIdId_prod,
  deleteProductFromCart
);

export default router;