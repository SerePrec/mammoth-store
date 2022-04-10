import { Router } from "express";
import { isAdminApi } from "../middlewares/auth.js";
import { uploadProductImage } from "../middlewares/multer.js";
import {
  validateId,
  validateProductPostBody,
  validateProductPutBody
} from "../middlewares/validateApiData.js";
import ApiProductsController from "../controllers/apiProductsController.js";

const router = Router();

class ApiProductsRouter {
  constructor() {
    this.apiProductsController = new ApiProductsController();
  }

  start() {
    router.get(
      "/:id?",
      this.apiProductsController.getAllProducts,
      validateId,
      this.apiProductsController.getProduct
    );

    router.post(
      "/",
      isAdminApi,
      uploadProductImage,
      validateProductPostBody,
      this.apiProductsController.createProduct
    );

    router.put(
      "/:id",
      isAdminApi,
      uploadProductImage,
      validateId,
      validateProductPutBody,
      this.apiProductsController.updateProduct
    );

    router.delete(
      "/:id",
      isAdminApi,
      validateId,
      this.apiProductsController.deleteProduct
    );

    return router;
  }
}

export default ApiProductsRouter;
