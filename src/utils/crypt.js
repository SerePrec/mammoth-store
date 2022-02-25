import bcrypt from "bcrypt";

const createHash = async password => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const isValidPassword = async (user, password) => {
  const match = await bcrypt.compare(password, user.password);
  return match;
};

export { createHash, isValidPassword };
