import {
  isTextRequired,
  isNumericId,
  isPrice,
  isInteger,
  isPositiveInteger,
  isURL
} from "../../utils/validations.js";

// Valida que sea el id numérico
const validateNumericId = (req, res, next) => {
  const { id } = req.params;
  if (!isNumericId(id))
    res.status(400).json({ error: "El parámetro no es válido" });
  else {
    next();
  }
};

// Valida que ambos ids sean numérico
const validateNumericIdId_prod = (req, res, next) => {
  const { id, id_prod } = req.params;
  if (!isNumericId(id) || !isNumericId(id_prod))
    res.status(400).json({ error: "El parámetro no es válido" });
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
    req.body.title = title.trim();
    req.body.detail = detail.trim();
    req.body.code = code.trim();
    req.body.brand = brand.trim();
    req.body.category = category.trim();
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
    req.body.title = title?.trim();
    req.body.detail = detail?.trim();
    req.body.code = code?.trim();
    req.body.brand = brand?.trim();
    req.body.category = category?.trim();
    req.body.price = price && Math.round(parseFloat(price) * 100) / 100;
    req.body.stock = stock && parseInt(stock);
    req.body.thumbnail = thumbnail?.trim();
    next();
  }
};

//Valida que el formato de datos del producto a incorporar o modificar al carrito sea válido
const validateCartProductBody = (req, res, next) => {
  let { id, quantity } = req.body;
  if (!isNumericId(id) || !isPositiveInteger(quantity))
    res.status(400).json({ error: "Los valores enviados no son válidos" });
  else {
    req.body.quantity = parseInt(quantity);
    next();
  }
};

export {
  validateNumericId,
  validateNumericIdId_prod,
  validateProductPostBody,
  validateProductPutBody,
  validateCartProductBody
};
