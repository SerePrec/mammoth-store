import { logger } from "../logger/index.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

class Error404Controller {
  getError404Api = (req, res, next) => {
    logger.warn(
      `ruta '${req.baseUrl + req.path}' método '${req.method}' no implementada`
    );
    res.status(404).json({
      error: "recurso no encontrado",
      descripcion: `ruta '${req.baseUrl + req.path}' método '${
        req.method
      }' no implementada`
    });
  };

  getError404Web = (req, res, next) => {
    logger.warn(
      `ruta '${req.baseUrl + req.path}' método '${req.method}' no implementada`
    );
    res.sendFile("404.html", {
      root: path.join(__dirname, "..", "views")
    });
  };
}

export default Error404Controller;
