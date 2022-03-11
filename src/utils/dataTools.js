import fs from "fs";
import path from "path";
import { logger } from "../logger/index.js";
import config from "../config.js";

// También util como asPOJO (plain old javascript object) para quedarse solo con un objetos con valores sinmétodos ni estados
export const deepClone = obj => JSON.parse(JSON.stringify(obj));

export const renameField = (record, from, to) => {
  record[to] = record[from];
  delete record[from];
  return record;
};

export const removeField = (record, field) => {
  const value = record[field];
  delete record[field];
  return value;
};

// funciones para devolver el mismo formato de timestamp tanto si se utiliza MySQL o SQLite
export const convertSQLTimestamp = timestamp =>
  typeof timestamp === "object"
    ? (timestamp = timestamp.toISOString())
    : (timestamp = timestamp.replace(" ", "T").concat("Z"));

export const verifyTimestamp = element => {
  if (element.timestamp) {
    element.timestamp = convertSQLTimestamp(element.timestamp);
  }
  return element;
};

export const escapeHtml = unsafe =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const formatoPrecio = num => {
  // Función para dar formato de precio con separadores de miles (.) y decimales (,)
  num = num.toFixed(2);
  let entero, decimales;
  if (num.indexOf(".") >= 0) {
    entero = num.slice(0, num.indexOf("."));
    decimales = num.slice(num.indexOf(".")).replace(".", ",");
  }
  let enteroFormateado = "";
  for (let i = 1; i <= entero.length; i++) {
    if (i % 3 == 0) {
      if (i == entero.length) {
        enteroFormateado =
          entero.substr(entero.length - i, 3) + enteroFormateado;
        break;
      }
      enteroFormateado =
        ".".concat(entero.substr(entero.length - i, 3)) + enteroFormateado;
    }
  }
  enteroFormateado = entero.slice(0, entero.length % 3) + enteroFormateado;
  num = enteroFormateado.concat(decimales);
  return num;
};

export const deleteAvatar = filename => {
  filename
    ? fs.unlink(path.join(config.uploadsImg.avatarsPath, filename), error =>
        error
          ? logger.error(error)
          : logger.debug("Avatar eliminado por registro fallido")
      )
    : null;
};

export const deleteThumbnail = filename => {
  filename
    ? fs.unlink(path.join(config.uploadsImg.productsPath, filename), error =>
        error
          ? logger.error(error)
          : logger.debug("Thumbnail eliminado por datos fallidos")
      )
    : null;
};
