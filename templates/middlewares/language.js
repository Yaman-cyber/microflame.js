const { ENGLISH } = require("../enums/requestLanguage.enum");

module.exports = async function (req, res, next) {
  let lang = req.headers.lang || ENGLISH;

  req.lang = lang;

  next();
};
