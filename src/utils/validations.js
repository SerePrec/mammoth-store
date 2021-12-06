export const isTextRequired = data =>
  typeof data == "string" && /\w+/.test(data);

export const isPrice = data =>
  (typeof data == "string" || typeof data == "number") &&
  /^\d+(\.\d+)?$/.test(data);

export const isInteger = data =>
  (typeof data == "string" || typeof data == "number") && /^-?\d+$/.test(data);

export const isURL = data =>
  typeof data == "string" && /^(ftp|http|https):\/\/[^ "]+$/.test(data);
