import {
  isTextRequired,
  isPrice,
  isInteger,
  isURL
} from "../../utils/validations.js";

// Valida que sea un id numérico
const validateId = (req, res, next) => {
  const id = req.params.id;
  if (isNaN(id)) res.status(400).json({ error: "El parámetro no es válido" });
  else {
    req.params.id = parseInt(id);
    next();
  }
};

//Valida que el formato de datos a guardar sea válido
const validatePostBody = (req, res, next) => {
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
    title = title.trim();
    detail = detail.trim();
    code = code.trim();
    brand = brand.trim();
    category = category.trim();
    price = Math.round(parseFloat(price) * 100) / 100;
    stock = parseInt(price);
    thumbnail = thumbnail.trim();
    req.body = {
      ...req.body,
      title,
      detail,
      code,
      brand,
      category,
      price,
      stock,
      thumbnail
    };
    next();
  }
};

//Valida que el formato de datos a actualizar sea válido
const validatePutBody = (req, res, next) => {
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
    title = title?.trim();
    detail = detail?.trim();
    code = code?.trim();
    brand = brand?.trim();
    category = category?.trim();
    price = price && Math.round(parseFloat(price) * 100) / 100;
    stock = stock && parseInt(stock);
    thumbnail = thumbnail?.trim();
    req.body = {
      ...req.body,
      title,
      detail,
      code,
      brand,
      category,
      price,
      stock,
      thumbnail
    };
    next();
  }
};

export { validateId, validatePostBody, validatePutBody };
