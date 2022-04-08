import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import AuthUserService from "../services/authUserService.js";
import config from "../config.js";
import { logger } from "../logger/index.js";

const authUserService = new AuthUserService();

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      return authUserService.verifyRegister(
        { body: req.body, file: req.file },
        username,
        password,
        done
      );
    }
  )
);

passport.use("login", new LocalStrategy(authUserService.verifyLogin));

passport.use(
  new GoogleStrategy(
    config.googleAuth,
    (accessToken, refreshToken, userProfile, done) => {
      logger.info(
        `Usuario '${userProfile.emails[0].value}' logueado con éxito`
      );
      return done(null, userProfile);
    }
  )
);

passport.serializeUser(authUserService.serializeUser);

passport.deserializeUser(authUserService.deserializeUser);

const passportAuthLogin = passport.authenticate("login", {
  failureRedirect: "/login-error",
  // connect-flash presenta más problemas de carrera al guardar sesiones en MongoDB y no en la memoria. Por eso los paso por la sesión de manera normal
  failureMessage: true,
  successRedirect: "/"
});

const passportAuthRegister = passport.authenticate("register", {
  failureRedirect: "/register-error",
  // connect-flash presenta más problemas de carrera al guardar sesiones en MongoDB y no en la memoria. Por eso los paso por la sesión de manera normal
  failureMessage: true,
  successRedirect: "/",
  successMessage: "¡Gracias por registrarte en nuestro sitio!"
});

const passportAuthGoogle = passport.authenticate("google", {
  scope: ["profile", "email"]
});

const passportAuthGoogleCb = passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/login-error"
});

export {
  passport,
  passportAuthLogin,
  passportAuthRegister,
  passportAuthGoogle,
  passportAuthGoogleCb
};
