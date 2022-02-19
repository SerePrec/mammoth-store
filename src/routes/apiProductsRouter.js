import { Router } from "express";
import {
  validateId,
  validateProductPostBody,
  validateProductPutBody
} from "../middlewares/validateData.js";
import { isAdmin } from "../middlewares/auth.js";
import { uploadProductImage } from "../middlewares/multer.js";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/apiProductsController.js";

const router = Router();

router.get("/:id?", getAllProducts, validateId, getProduct);

router.post(
  "/",
  isAdmin,
  uploadProductImage,
  validateProductPostBody,
  createProduct
);

router.put(
  "/:id",
  isAdmin,
  uploadProductImage,
  validateId,
  validateProductPutBody,
  updateProduct
);

router.delete("/:id", isAdmin, validateId, deleteProduct);

export default router;
