const emailEvent = require("../events/email.event");

module.exports = function (eventEmitter) {
  emailEvent(eventEmitter);
};
