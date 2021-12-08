import {
  isTextRequired,
  isNumericId,
  isPrice,
  isInteger,
  isPositiveInteger,
  isURL
} from "../../utils/validations.js";

// Valida que sea un id numérico
const validateNumericId = (req, res, next) => {
  const { id } = req.params;
  if (!isNumericId(id))
    res.status(400).json({ error: "El parámetro no es válido" });
  else {
    next();
  }
};

//Valida que el formato de datos del producto a guardar sea válido
const validateProductPostBody = (req, res, next) => {
  let { title, detail, code, brand, category, price, stock, thumbnail } =
    req.body;
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
    req.body.stock = parseInt(price);
    req.body.thumbnail = thumbnail.trim();
    next();
  }
};

//Valida que el formato de datos del producto a actualizar sea válido
const validateProductPutBody = (req, res, next) => {
  let { title, detail, code, brand, category, price, stock, thumbnail } =
    req.body;
  if (
    (title !== undefined && !isTextRequired(title)) ||
    (detail !== undefined && !isTextRequired(detail)) ||
    (code !== undefined && !isTextRequired(code)) ||
    (brand !== undefined && !isTextRequired(brand)) ||
    (category !== undefined && !isTextRequired(category)) ||
    (price !== undefined && !isPrice(price)) ||
    (stock !== undefined && !isInteger(stock)) ||
    (thumbnail !== undefined && !isURL(thumbnail))
  )
    res.status(400).json({ error: "Los valores enviados no son válidos" });
  else if (
    title === undefined &&
    detail === undefined &&
    code === undefined &&
    brand === undefined &&
    category === undefined &&
    price === undefined &&
    stock === undefined &&
    thumbnail == undefined
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
  validateProductPostBody,
  validateProductPutBody,
  validateCartProductBody
};
