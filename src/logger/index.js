import buildDevLogger from "./dev-logger.js";
import buildProdLogger from "./prod-logger.js";
import config from "../config.js";

// construyo el logger personalizado según el entorno
const logger =
  config.NODE_ENV === "production" ? buildProdLogger() : buildDevLogger();

export { logger };
