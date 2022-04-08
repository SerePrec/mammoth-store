import { usersModel } from "../models/index.js";
import { createHash, isValidPassword } from "../utils/crypt.js";
import { deleteAvatar } from "../utils/dataTools.js";
import { sendEmail, renderRegisterTable } from "../email/nodemailer-gmail.js";
import config from "../config.js";
import { logger } from "../logger/index.js";

class AuthUserService {
  constructor() {
    this.usersModel = usersModel;
  }

  verifyRegister = async (customObject, username, password, done) => {
    try {
      const user = await this.usersModel.getByUsername(username);
      if (user) {
        deleteAvatar(customObject.file?.filename);
        return done(null, false, {
          message: "El nombre de usuario ya existe"
        });
      }
      const { name, address, age, phone, avatar } = customObject.body;
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
      const newUserAdded = await this.usersModel.save(newUser);
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
      deleteAvatar(customObject.file?.filename);
      logger.error(`Error al registrar usuario: ${error}`);
      done(error);
    }
  };

  verifyLogin = async (username, password, done) => {
    try {
      const user = await this.usersModel.getByUsername(username);
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
  };

  // >>>> Solo para local strategy
  // serializeUser = (user, done) => done(null, user.id);
  // deserializeUser = async (id, done) => {
  //   try {
  //     const user = await this.userModel.getById(id);
  //     done(null, user);
  //   } catch (error) {
  //     done(error);
  //   }
  // };

  // >>>> Combinando ambas opciones de serialización
  serializeUser = (user, done) => {
    if (user.provider) {
      done(null, user);
    } else {
      done(null, user.id);
    }
  };

  deserializeUser = async (data, done) => {
    if (data.provider) {
      done(null, data);
    } else {
      try {
        const id = data;
        const user = await this.usersModel.getById(id);
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  };
}

export default AuthUserService;
