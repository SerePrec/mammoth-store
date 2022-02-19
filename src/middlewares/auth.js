// Variable booleana para simular autenticación del usuario
const admin = true;

export const isAdmin = (req, res, next) =>
  admin
    ? next()
    : res.status(401).json({
        error: -1,
        descripcion: `ruta '${req.baseUrl + req.path}' método '${
          req.method
        }' no autorizada`
      });
