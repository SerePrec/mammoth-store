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
