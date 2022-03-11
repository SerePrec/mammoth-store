import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../config.js";
import { usersModel } from "../models/index.js";
import { createHash, isValidPassword } from "../utils/crypt.js";
import { deleteAvatar } from "../utils/dataTools.js";
import { sendEmail, renderRegisterTable } from "../email/nodemailer-gmail.js";
import { logger } from "../logger/index.js";

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        const user = await usersModel.getByUsername(username);
        if (user) {
          deleteAvatar(req.file?.filename);
          return done(null, false, {
            message: "El nombre de usuario ya existe"
          });
        }
        const { name, address, age, phone, avatar } = req.body;
        const newUser = {
          username,
          password: await createHash(password),
          name,
          address,
          age,
          phone,
          avatar,
          role: "user"
        };
        const newUserAdded = await usersModel.save(newUser);
        logger.info(
          `Usuario '${username}' registrado con éxito con id ${newUserAdded.id}`
        );
        // Envío email asíncronicamente en paralelo (No espero para continuar ni lanzo al catch en caso de error).
        // Solo se manda al logger el error en caso de haberlo, para no afectar el registro por un error de envío de email.
        sendEmail(
          config.email.adminEmail,
          "Nuevo Registro",
          renderRegisterTable(newUser)
        );
        return done(null, newUserAdded);
      } catch (error) {
        deleteAvatar(req.file?.filename);
        logger.error(`Error al registrar usuario: ${error}`);
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
        logger.warn(`Fallo de login: Usuario '${username}' no existe`);
        return done(null, false, {
          message: "Nombre de usuario y/o contraseña incorrectos"
        });
      }
      if (!(await isValidPassword(user, password))) {
        logger.warn(
          `Fallo de login: Contraseña de usuario '${username}' incorrecta`
        );
        return done(null, false, {
          message: "Nombre de usuario y/o contraseña incorrectos"
        });
      }
      logger.info(`Usuario '${username}' logueado con éxito`);
      return done(null, user);
    } catch (error) {
      logger.error(`Error al loguear usuario: ${error}`);
      done(error);
    }
  })
);

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
