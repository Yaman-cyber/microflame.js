const handler = require("../handlers/email.handler");
const eventsNames = require("../constants/events.json");

module.exports = function (event) {
  event.on(eventsNames.email.verifyOTP, handler.sendVerifyOTP);
};
