import { Router } from "express";
import { isNotAuthWeb } from "../middlewares/auth.js";
import { uploadAvatarImage } from "../middlewares/multer.js";
import {
  passportAuthLogin,
  passportAuthRegister,
  passportAuthGoogle,
  passportAuthGoogleCb
} from "../middlewares/passport.js";
import { validateRegisterPost } from "../middlewares/validateWebData.js";
import AuthController from "../controllers/authController.js";

const router = Router();

class AuthRouter {
  constructor() {
    this.authController = new AuthController();
  }
  start() {
    router.get("/login", this.authController.getLogin);

    router.post("/login", isNotAuthWeb, passportAuthLogin);

    router.get("/login-error", this.authController.getLoginError);

    router.get("/register", this.authController.getRegister);

    router.post(
      "/register",
      isNotAuthWeb,
      uploadAvatarImage,
      validateRegisterPost,
      passportAuthRegister
    );

    router.get("/register-error", this.authController.getRegisterError);

    router.get("/auth/google", passportAuthGoogle);

    router.get("/auth/google/callback", passportAuthGoogleCb);

    router.get("/logout", this.authController.getLogout);

    return router;
  }
}

export default AuthRouter;
