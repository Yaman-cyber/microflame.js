const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = `${config.get("db.protocol")}://${config.get("db.username")}:${config.get("db.password")}${config.get("db.host")}/${config.get("db.name")}`;

  mongoose
    .connect(db)
    .then(() => winston.info(`Connected to Database...`))
    .catch((err) => winston.error(`failed to connect to Database. an error occurred: ${err}`));
};
