const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivatekey")) {
    throw new Error("FATAL ERROR:jwtPrivatekey is not defined");
  }

  if (!config.get("db.protocol")) {
    throw new Error("FATAL ERROR:db.protocol is not defined");
  }

  if (!config.get("db.username")) {
    throw new Error("FATAL ERROR:db.username is not defined");
  }

  if (!config.get("db.password")) {
    throw new Error("FATAL ERROR:db.password is not defined");
  }

  if (!config.get("db.host")) {
    throw new Error("FATAL ERROR:db.host is not defined");
  }

  if (!config.get("db.name")) {
    throw new Error("FATAL ERROR:db.name is not defined");
  }

  if (!config.get("environment")) {
    throw new Error("FATAL ERROR:environment is not defined");
  }
};
