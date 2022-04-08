import { Router } from "express";
import {
  validateId,
  validateProductPostBody,
  validateProductPutBody
} from "../middlewares/validateApiData.js";
import { isAdminApi } from "../middlewares/auth.js";
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
  isAdminApi,
  uploadProductImage,
  validateProductPostBody,
  createProduct
);

router.put(
  "/:id",
  isAdminApi,
  uploadProductImage,
  validateId,
  validateProductPutBody,
  updateProduct
);

router.delete("/:id", isAdminApi, validateId, deleteProduct);

export default router;
