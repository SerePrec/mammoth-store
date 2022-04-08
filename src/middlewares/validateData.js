import ValidateDataService from "../services/validateDataService.js";
import {
  isTextRequired,
  isPrice,
  isInteger,
  isPositiveInteger,
  isAlphanumeric,
  isValidPhone,
  isURL
} from "../utils/validations.js";
import { deleteThumbnail, escapeHtml } from "../utils/dataTools.js";

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

//Valida que el formato de datos del producto a guardar sea válido
const validateProductPostBody = (req, res, next) => {
  let { title, detail, code, brand, category, price, stock, thumbnail } =
    req.body;
  thumbnail = thumbnail?.trim()
    ? thumbnail?.trim()
    : `/img/productos/generic_product.svg`;
  const filename = req.file?.filename;
  thumbnail = filename ? `/img/productos/${filename}` : thumbnail;
  if (
    !isTextRequired(title) ||
    !isTextRequired(detail) ||
    !isTextRequired(code) ||
    !isTextRequired(brand) ||
    !isTextRequired(category) ||
    !isPrice(price) ||
    !isInteger(stock) ||
    !isURL(thumbnail)
  ) {
    deleteThumbnail(filename);
    res.status(400).json({ error: "Los valores enviados no son válidos" });
  } else {
    req.body.title = escapeHtml(title.trim());
    req.body.detail = escapeHtml(detail.trim());
    req.body.code = escapeHtml(code.trim());
    req.body.brand = escapeHtml(brand.trim());
    req.body.category = escapeHtml(category.trim());
    req.body.price = Math.round(parseFloat(price) * 100) / 100;
    req.body.stock = parseInt(stock);
    req.body.thumbnail = thumbnail.trim();
    next();
  }
};

//Valida que el formato de datos del producto a actualizar sea válido
const validateProductPutBody = (req, res, next) => {
  let { title, detail, code, brand, category, price, stock, thumbnail } =
    req.body;
  const filename = req.file?.filename;
  thumbnail = filename ? `/img/productos/${filename}` : thumbnail;
  if (
    (title && !isTextRequired(title)) ||
    (detail && !isTextRequired(detail)) ||
    (code && !isTextRequired(code)) ||
    (brand && !isTextRequired(brand)) ||
    (category && !isTextRequired(category)) ||
    (price && !isPrice(price)) ||
    (stock && !isInteger(stock)) ||
    (thumbnail && !isURL(thumbnail))
  )
    res.status(400).json({ error: "Los valores enviados no son válidos" });
  else if (
    !title &&
    !detail &&
    !code &&
    !brand &&
    !category &&
    !price &&
    !stock &&
    !thumbnail
  ) {
    deleteThumbnail(filename);
    res.status(400).json({ error: "No hay campos válidos para actualizar" });
  } else {
    req.body.title = escapeHtml(title?.trim());
    req.body.detail = escapeHtml(detail?.trim());
    req.body.code = escapeHtml(code?.trim());
    req.body.brand = escapeHtml(brand?.trim());
    req.body.category = escapeHtml(category?.trim());
    req.body.price = price && Math.round(parseFloat(price) * 100) / 100;
    req.body.stock = stock && parseInt(stock);
    req.body.thumbnail = thumbnail?.trim();
    next();
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
