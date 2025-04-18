const config = require("config");
const moment = require("moment");
const winston = require("winston");
require("express-async-errors");

module.exports = function () {
  const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, stack }) => {
        return `${moment(timestamp).format("YYYY-MM-DD HH:mm:ss")} [${level.toUpperCase()}]: ${message} - ${stack ? stack : ""}`;
      })
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        level: "debug", // Log all levels to the console
      }),
      new winston.transports.File({
        filename: `logs/${moment().format("YYYY-MM-DD")}-logfile.log`,
        level: "debug", // Log all levels to the file
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({
        filename: `logs/${moment().format("YYYY-MM-DD")}-logfile.log`,
        level: "error",
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: `logs/${moment().format("YYYY-MM-DD")}-logfile.log`,
        level: "error",
      }),
    ],
  });

  // Handle unhandled rejections
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  if (config.get("environment") !== "test") winston.add(logger);
};
