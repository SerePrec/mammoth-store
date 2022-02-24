import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const getLogin = (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/");
  res.sendFile("login.html", {
    root: path.join(__dirname, "..", "views")
  });
};

//FIXME:
// export const getLoginError = (req, res) => {
//   const { messages } = req.session;
//   let message;
//   if (messages) {
//     req.session.messages = [];
//     message = messages[messages.length - 1];
//   }
//   res.render("pages/loginError", {
//     title: "Error de login",
//     error: message
//   });
// };

export const getRegister = (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/");
  res.sendFile("register.html", {
    root: path.join(__dirname, "..", "views")
  });
};

//FIXME:
// export const getRegisterError = (req, res) => {
//   const { messages } = req.session;
//   let message;
//   if (messages) {
//     req.session.messages = [];
//     message = messages[messages.length - 1];
//   }
//   res.render("pages/registerError", {
//     title: "Error de registro",
//     error: message
//   });
// };

//FIXME:
// export const getLogout = (req, res) => {
//   if (req.isAuthenticated()) {
//     const { username } = req.user;
//     req.logout();
//     req.session.destroy(err => {
//       if (!err) {
//         res.clearCookie("connect.sid");
//         return res.render("./pages/logout", { title: "Logout", username });
//       }
//       res.redirect("/");
//     });
//   } else {
//     res.redirect("/");
//   }
// };
