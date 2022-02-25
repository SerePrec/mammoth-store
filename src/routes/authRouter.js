import { Router } from "express";
import { validateRegisterPost } from "../middlewares/validateWebData.js";
import {
  passportAuthLogin,
  passportAuthRegister,
  passportAuthGoogle,
  passportAuthGoogleCb
} from "../middlewares/passport.js";
import { isNotAuthWeb } from "../middlewares/auth.js";
import { uploadAvatarImage } from "../middlewares/multer.js";
import * as controller from "../controllers/authController.js";

const router = Router();

router.get("/login", controller.getLogin);

router.post("/login", isNotAuthWeb, passportAuthLogin);

router.get("/login-error", controller.getLoginError);

router.get("/register", controller.getRegister);

router.post(
  "/register",
  isNotAuthWeb,
  uploadAvatarImage,
  validateRegisterPost,
  passportAuthRegister
);

router.get("/register-error", controller.getRegisterError);

router.get("/auth/google", passportAuthGoogle);

router.get("/auth/google/callback", passportAuthGoogleCb);

router.get("/logout", controller.getLogout);

export default router;
