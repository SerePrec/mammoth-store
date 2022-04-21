import morgan from "morgan";
import { logger } from "../logger/index.js";

const morganLogger = morgan("dev", {
  stream: {
    // Configuro Morgan para usar el logger con level http
    write: message => logger.http(message.trim())
  }
});

export { morganLogger };
