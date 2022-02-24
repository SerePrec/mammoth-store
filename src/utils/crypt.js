import bcrypt from "bcrypt";

const createHash = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export { createHash, isValidPassword };
