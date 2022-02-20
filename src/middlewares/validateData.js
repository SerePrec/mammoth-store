import config from "../config.js";
import {
  isTextRequired,
  isNumericId,
  isPrice,
  isInteger,
  isPositiveInteger,
  isAlphanumeric,
  isURL
} from "../utils/validations.js";
import { escapeHtml } from "../utils/dataTools.js";

let idValidator;
(function assignIdValidator() {
  const persWithNumId = ["mem", "fs", "mariadb", "sqlite3"];
  const pers = config.PERS;
  persWithNumId.includes(pers)
    ? (idValidator = isNumericId)
    : (idValidator = isAlphanumeric);
})();

// Valida que sea id numérico o alfanumérico según el tipo de persistencia
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!idValidator(id))
    res.status(400).json({ error: "El id no es de un formato válido" });
  else {
    next();
  }
};

// Valida que ambos ids sean numéricos o alfanuméricos según el tipo de persistencia
const validateIdId_prod = (req, res, next) => {
  const { id, id_prod } = req.params;
  if (!idValidator(id) || !idValidator(id_prod))
    res.status(400).json({ error: "El id no es de un formato válido" });
  else {
    next();
  }
};

//Valida que el formato de datos del producto a guardar sea válido
const validateProductPostBody = (req, res, next) => {
  let { title, detail, code, brand, category, price, stock, thumbnail } =
    req.body;
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
  )
    res.status(400).json({ error: "Los valores enviados no son válidos" });
  else {
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
  )
    res.status(400).json({ error: "No hay campos válidos para actualizar" });
  else {
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
const validateCartProductBody = (req, res, next) => {
  let { id, quantity } = req.body;
  if (!idValidator(id) || !isPositiveInteger(quantity))
    res.status(400).json({ error: "Los valores enviados no son válidos" });
  else {
    req.body.quantity = parseInt(quantity);
    next();
  }
};

export {
  validateId,
  validateIdId_prod,
  validateProductPostBody,
  validateProductPutBody,
  validateCartProductBody
};
