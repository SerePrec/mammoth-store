import buildDevLogger from "./dev-logger.js";
import buildProdLogger from "./prod-logger.js";
import config from "../config.js";

const logger =
  config.NODE_ENV !== "production" ? buildProdLogger() : buildDevLogger();

export { logger };
