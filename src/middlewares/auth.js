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
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    error: "No autenticado",
    descripcion: `ruta '${req.baseUrl + req.path}' método '${
      req.method
    }' necesita autenticación`
  });
};

// Lo utilizo para desviar el flujo en caso de que ya se encuentre el usuario autenticado
// Así se busca que el usuario cierre sesión antes de ello. (Ej: login y registro sólo si no hay sesión activa)
const isNotAuthWeb = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};

const isUserCart = (req, res, next) => {
  if (req.session?.cartId == req.params.id) {
    return next();
  }
  res.status(403).json({
    error: "No autorizado",
    descripcion: `El id del carrito al que intenta acceder no fue asignado al usuario`
  });
};

export { isAuthWeb, isAuthApi, isNotAuthWeb, isUserCart, isAdmin };
