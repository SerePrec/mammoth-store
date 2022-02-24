import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../config.js";
import { usersModel } from "../models/index.js";
import { createHash, isValidPassword } from "../utils/crypt.js";

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        const user = await usersModel.getByUsername(username);
        if (user) {
          return done(null, false, {
            message: "El nombre de usuario ya existe"
          });
        }
        const newUser = {
          username,
          password: createHash(password)
        };
        const newUserAdded = await usersModel.save(newUser);
        console.log(`Usuario registrado con éxito con id ${newUserAdded.id}`);
        return done(null, newUserAdded);
      } catch (error) {
        console.log("Error al registrar usuario: ", error);
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await usersModel.getByUsername(username);
      if (!user) {
        return done(null, false, {
          message: "Nombre de usuario y/o contraseña incorrectos"
        });
      }
      if (!isValidPassword(user, password)) {
        return done(null, false, {
          message: "Nombre de usuario y/o contraseña incorrectos"
        });
      }
      return done(null, user);
    } catch (error) {
      console.log("Error al loguear usuario: ", error);
      done(error);
    }
  })
);

passport.use(
  new GoogleStrategy(
    config.googleAuth,
    (accessToken, refreshToken, userProfile, done) => {
      return done(null, userProfile);
    }
  )
);

// >>>> Solo para local strategy
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await userModel.getById(id);
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });

// >>>> Combinando ambas opciones de serialización
passport.serializeUser((user, done) => {
  if (user.provider) {
    done(null, user);
  } else {
    done(null, user.id);
  }
});

passport.deserializeUser(async (data, done) => {
  if (data.provider) {
    done(null, data);
  } else {
    try {
      const id = data;
      const user = await usersModel.getById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
});

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
