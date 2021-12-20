export const deepClone = obj => JSON.parse(JSON.stringify(obj));

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
