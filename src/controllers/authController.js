import config from "../config.js";
import { logger } from "../logger/index.js";

class AuthController {
  getLogin = (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    res.sendFile("login.html", {
      root: config.viewsPath
    });
  };

  getLoginError = (req, res) => {
    const { messages } = req.session;
    let message;
    if (messages) {
      req.session.messages = [];
      message = messages[messages.length - 1];
    }
    res.render("pages/loginError", {
      title: "Mammoth Bike Store | Error de login",
      error: message
    });
  };

  getRegister = (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    res.sendFile("register.html", {
      root: config.viewsPath
    });
  };

  getRegisterError = (req, res) => {
    const { messages } = req.session;
    let message;
    if (messages) {
      req.session.messages = [];
      message = messages[messages.length - 1];
    }
    res.render("pages/registerError", {
      title: "Mammoth Bike Store | Error de registro",
      error: message
    });
  };

  getLogout = (req, res) => {
    if (req.isAuthenticated()) {
      const { user } = req;
      const name = user.provider ? user.displayName : user.name;
      const username = user.provider ? user.emails[0].value : user.username;
      req.logout();
      req.session.destroy(err => {
        if (!err) {
          res.clearCookie("connect.sid");
          logger.info(`Logout de usuario '${username}'`);
          return res.render("./pages/logout", {
            title: "Mammoth Bike Store | Logout",
            name
          });
        }
        res.redirect("/");
      });
    } else {
      res.redirect("/");
    }
  };
}

export default AuthController;
