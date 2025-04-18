const responseCodes = require("../constants/responseCodes.json");

module.exports = async function (req, res, next) {
  const { code, data, message, metadata = {} } = res;

  if (!code) return next(); //To handle 404 not found routes

  return res.status(code).send({
    data,
    success: code === responseCodes.success,
    message,
    metadata,
  });
};
