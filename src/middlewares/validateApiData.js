import ValidateDataService from "../services/validateDataService.js";
import { deleteThumbnail } from "../utils/dataTools.js";

const validateDataService = new ValidateDataService();

const validateId = (req, res, next) => {
  const { id } = req.params;
  const validated = validateDataService.validateId(id);
  if (validated && !validated.error) next();
  else {
    res.status(400).json({ error: validated.error });
  }
};

const validateIdId_prod = (req, res, next) => {
  const { id, id_prod } = req.params;
  let validated = validateDataService.validateId(id);
  if (validated && validated.error)
    return res.status(400).json({ error: validated.error });
  validated = validateDataService.validateId(id_prod);
  if (validated && validated.error)
    return res.status(400).json({ error: validated.error });
  next();
};

const validateProductPostBody = (req, res, next) => {
  const data = req.body;
  const filename = req.file?.filename;
  const validated = validateDataService.validateProductPostBody(data, filename);
  if (validated && !validated.error) {
    req.body = { ...validated };
    next();
  } else {
    deleteThumbnail(filename);
    res.status(400).json({ error: validated.error });
  }
};

//Valida que el formato de datos del producto a actualizar sea válido
const validateProductPutBody = (req, res, next) => {
  const data = req.body;
  const filename = req.file?.filename;
  const validated = validateDataService.validateProductPutBody(data, filename);
  if (validated && !validated.error) {
    req.body = { ...validated };
    next();
  } else {
    deleteThumbnail(filename);
    res.status(400).json({ error: validated.error });
  }
};

//Valida que el formato de datos del producto a incorporar o modificar al carrito sea válido
// const validateCartProductBody = (req, res, next) => {
//   let { id, quantity } = req.body;
//   if (!idValidator(id) || !isPositiveInteger(quantity))
//     res.status(400).json({ error: "Los valores enviados no son válidos" });
//   else {
//     req.body.quantity = parseInt(quantity);
//     next();
//   }
// };

// Valida que sea un formato de datos válido generar una órden
// const validateOrderPost = (req, res, next) => {
//   const { id, name, address, phone, cp } = req.body;
//   if (
//     !idValidator(id) ||
//     !isTextRequired(name) ||
//     !isTextRequired(address) ||
//     !isValidPhone(phone) ||
//     !isAlphanumeric(cp)
//   ) {
//     res.status(400).json({ error: "Los valores enviados no son válidos" });
//   } else {
//     req.body.name = escapeHtml(name.trim());
//     req.body.address = escapeHtml(address.trim());
//     next();
//   }
// };

const validateCartProductBody = () => {};
const validateOrderPost = () => {};
export {
  validateId,
  validateIdId_prod,
  validateProductPostBody,
  validateProductPutBody,
  validateCartProductBody,
  validateOrderPost
};
