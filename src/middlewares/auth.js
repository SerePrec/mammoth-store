//FIXME:FIXME: Variable booleana para simular autenticación del usuario
const admin = true;

const isAdmin = (req, res, next) =>
  admin
    ? next()
    : res.status(403).json({
        error: -1,
        descripcion: `ruta '${req.baseUrl + req.path}' método '${
          req.method
        }' no autorizada`
      });

const isAuthWeb = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

const isAuthApi = (req, res, next) => {
  //FIXME:
  // if (req.isAuthenticated()) {
  //   return next();
  // }
  if (req.session.username) {
    return next();
  }
  res.status(401).json({
    error: "No autenticado",
    descripcion: `ruta '${req.baseUrl + req.path}' método '${
      req.method
    }' necesita autenticación`
  });
};

export { isAuthWeb, isAuthApi, isAdmin };
