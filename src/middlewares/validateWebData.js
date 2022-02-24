import {
  isTextRequired,
  isValidAge,
  isValidPhone,
  isValidUsername,
  isValidPwd
} from "../utils/validations.js";
import { escapeHtml } from "../utils/dataTools.js";

// Valida que sea un formato de usuario válido para guardar en la BD
const validateRegisterPost = (req, res, next) => {
  const { name, address, age, phone, username, password } = req.body;
  const filename = req.file?.filename;
  const avatar = filename
    ? `/img/avatars/${filename}`
    : `/img/avatars/default_avatar.svg`;
  if (
    !isTextRequired(name) ||
    !isTextRequired(address) ||
    !isValidAge(age) ||
    !isValidPhone(phone) ||
    !isValidUsername(username) ||
    !isValidPwd(password)
  ) {
    res.redirect("/register");
  } else {
    req.body.name = escapeHtml(name.trim());
    req.body.address = escapeHtml(address.trim());
    req.body.age = parseInt(age);
    req.body.username = escapeHtml(username);
    req.body.avatar = avatar;
    next();
  }
};

export { validateRegisterPost };
