const config = require("config");
const moment = require("moment");
const winston = require("winston");
require("winston-daily-rotate-file");
require("express-async-errors");

module.exports = function () {
  const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: "logs/%DATE%-logfile.log",
    datePattern: "YYYY-MM-DD",
    level: "debug",
  });

  const dailyRotateFileExceptionTransport = new winston.transports.DailyRotateFile({
    filename: "logs/%DATE%-logfile.log",
    datePattern: "YYYY-MM-DD",
    level: "error",
  });

  const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, stack }) => {
        return `${moment(timestamp).format("YYYY-MM-DD HH:mm:ss")} [${level.toUpperCase()}]: ${message} - ${stack ? stack : ""}`;
      }),
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        level: "debug", // Log all levels to the console
      }),
      dailyRotateFileTransport,
    ],
    exceptionHandlers: [dailyRotateFileExceptionTransport],
    rejectionHandlers: [dailyRotateFileExceptionTransport],
  });

  // Handle unhandled rejections
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  // If not in test environment, add the logger
  if (config.get("environment") !== "test") winston.add(logger);
};
