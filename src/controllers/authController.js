import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const getLogin = (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/");
  res.sendFile("login.html", {
    root: path.join(__dirname, "..", "views")
  });
};

export const getLoginError = (req, res) => {
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

export const getRegister = (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/");
  res.sendFile("register.html", {
    root: path.join(__dirname, "..", "views")
  });
};

export const getRegisterError = (req, res) => {
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

export const getLogout = (req, res) => {
  if (req.isAuthenticated()) {
    const { user } = req;
    const name = user.provider ? user.displayName : user.name;
    req.logout();
    req.session.destroy(err => {
      if (!err) {
        res.clearCookie("connect.sid");
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
