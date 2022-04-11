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
const validateCartProductBody = (req, res, next) => {
  const data = req.body;
  const validated = validateDataService.validateCartProductBody(data);
  if (validated && !validated.error) {
    req.body = { ...validated };
    next();
  } else {
    res.status(400).json({ error: validated.error });
  }
};

// Valida que sea un formato de datos válido generar una órden
const validateOrderPost = (req, res, next) => {
  const data = req.body;
  const validated = validateDataService.validateOrderPost(data);
  if (validated && !validated.error) {
    req.body = { ...validated };
    next();
  } else {
    res.status(400).json({ error: validated.error });
  }
};

export {
  validateId,
  validateIdId_prod,
  validateProductPostBody,
  validateProductPutBody,
  validateCartProductBody,
  validateOrderPost
};
