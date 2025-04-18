const { User } = require("../../../models/user.model");

const validate = require("../../../validators/auth");

const { VERIFY } = require("../../../enums/otpVerificationTypes.enum");

const messages = require("../../../constants/messages.json");
const eventsNames = require("../../../constants/events.json");
const responseCodes = require("../../../constants/responseCodes.json");

const eventEmitter = require("../../../helpers/event");

exports.logIn = async (req, res, next) => {
  const { lang, body } = req;

  const { error, user } = await validate.loginValid(body, lang);

  if (error) {
    res.code = responseCodes.badRequest;
    res.data = null;
    res.message = error.details[0].message;
    return next();
  }

  const token = user.verifiedAt ? await user.generateAuthToken(req) : null;
  const data = user.toObject();
  data.token = token;

  res.code = responseCodes.success;
  res.data = data;
  res.message = !token ? messages[lang].verifyAccountFirst : messages[lang].logInSuccess;
  return next();
};

exports.signup = async (req, res, next) => {
  const { lang, body } = req;
  const { email, name, password } = body;

  const { error } = await validate.signupValid(body, lang);

  if (error) {
    res.code = responseCodes.badRequest;
    res.message = error.details[0].message;
    return next();
  }

  const user = await new User({
    email,
    name: name || email.split("@")[0],
    password,
  }).save();

  res.data = user;
  res.code = responseCodes.success;
  res.message = messages[lang].signupSuccess;

  eventEmitter.emit(eventsNames.email.verifyOTP, { email, type: VERIFY });

  return next();
};
