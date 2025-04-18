const config = require("config");
const jwt = require("jsonwebtoken");

const { User } = require("../../models/user.model");

const responseCodes = require("../../constants/responseCodes.json");
const messages = require("../../constants/messages.json");

module.exports = async function (req, res, next) {
  let lang = req.lang;
  const token = req.header("authorization");

  if (!token)
    return res.status(responseCodes.unAuthorized).send({
      success: false,
      unAuthorized: true,
      message: messages[lang].unAuthorized,
    });

  try {
    const decode = jwt.verify(token, config.get("jwtPrivatekey"));

    const userInfo = await User.findById(decode._id);

    req.token = token;
    req.user = userInfo;
  } catch (error) {
    return res.status(responseCodes.unAuthorized).send({
      success: false,
      unAuthorized: true,
      message: messages[lang].unAuthorized,
    });
  }

  next();
};
