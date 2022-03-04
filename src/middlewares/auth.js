import { logger } from "../logger/index.js";

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
  logger.warn(
    `ruta '${req.baseUrl + req.path}' método '${
      req.method
    }' necesita autenticación`
  );
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
  if (req.session?.cartId == req.params.id || req.user.role === "admin") {
    return next();
  }
  logger.warn(
    `El id del carrito al que se intenta acceder no fue asignado al usuario`
  );
  res.status(403).json({
    error: "No autorizado",
    descripcion: `El id del carrito al que intenta acceder no fue asignado al usuario`
  });
};

const isAdminWeb = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  res.redirect("/");
};

const isAdminApi = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  logger.warn(
    `ruta '${req.baseUrl + req.path}' método '${req.method}' no autorizada`
  );
  res.status(403).json({
    error: -1,
    descripcion: `ruta '${req.baseUrl + req.path}' método '${
      req.method
    }' no autorizada`
  });
};

const isNotAdminWeb = (req, res, next) => {
  if (req.user.role === "admin") {
    return res.redirect("/productos/admin");
  }
  next();
};

export {
  isAuthWeb,
  isAuthApi,
  isNotAuthWeb,
  isUserCart,
  isAdminWeb,
  isAdminApi,
  isNotAdminWeb
};
