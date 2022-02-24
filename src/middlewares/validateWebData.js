// Valida que sea un formato de usuario válido para guardar en la BD
const validateRegisterPost = (req, res, next) => {
  const { username, password } = req.body;
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      username
    ) ||
    !(typeof password === "string" && password.length >= 6)
  ) {
    res.redirect("/register");
  } else {
    next();
  }
};

export { validateRegisterPost };
