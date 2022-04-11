import ValidateDataService from "../services/validateDataService.js";
import { deleteAvatar } from "../utils/dataTools.js";

const validateDataService = new ValidateDataService();

// Valida que sea un formato de usuario válido para guardar en la BD
const validateRegisterPost = (req, res, next) => {
  const data = req.body;
  const filename = req.file?.filename;
  const validated = validateDataService.validateRegisterPost(data, filename);
  if (validated && !validated.error) {
    req.body = { ...validated };
    next();
  } else {
    deleteAvatar(filename);
    res.redirect("/register");
  }
};

export { validateRegisterPost };
