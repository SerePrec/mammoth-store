export const isTextRequired = data =>
  typeof data == "string" && /\w+/.test(data);

export const isNumericId = data =>
  (typeof data == "string" || typeof data == "number") && /^\d+$/.test(data);

export const isAlphanumeric = data =>
  (typeof data == "string" || typeof data == "number") && /^\w+$/.test(data);

export const isPrice = data =>
  (typeof data == "string" || typeof data == "number") &&
  /^\d+(\.\d+)?$/.test(data);

export const isInteger = data =>
  (typeof data == "string" || typeof data == "number") && /^-?\d+$/.test(data);

export const isPositiveInteger = data =>
  (typeof data == "string" || typeof data == "number") &&
  /^\d+$/.test(data) &&
  parseInt(data) > 0;

export const isURL = data =>
  typeof data == "string" &&
  /^(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}|[/])\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
    data
  );
