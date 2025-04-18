const winston = require("winston");

const responseCodes = require("../constants/responseCodes.json");

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);

  res.status(responseCodes.internalServerError).send({ message: "Something broke!", success: false });
};
