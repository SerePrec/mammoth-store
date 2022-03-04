import { format, createLogger, transports } from "winston";
import path from "path";
import config from "../config.js";
const { timestamp, combine, printf, errors, json, label } = format;

const buildProdLogger = () => {
  const PID = process.pid;
  const logFormat = printf(({ level, message, timestamp, label, stack }) => {
    return `${timestamp} [PID ${label}] ${level}: ${stack || message}`;
  });

  return createLogger({
    level: "info",
    format: combine(label({ label: PID }), errors({ stack: true })), //errors debe ir a este nivel, sino no lo toma
    transports: [
      new transports.Console({
        format: combine(format.colorize(), timestamp(), logFormat)
      }),
      new transports.File({
        filename: path.join(config.logsFolder, "errors.log"),
        level: "warn",
        format: combine(timestamp(), json())
      })
    ]
  });
};

export default buildProdLogger;
