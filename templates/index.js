const winston = require("winston");
const express = require("express");
require("dotenv").config();

const schedule = require("node-schedule");
const eventEmitter = require("./helpers/event");
const app = express();

require("./start/logging")();
require("./start/routes")(app);
require("./start/db")();
require("./start/config")();
require("./start/cron")(schedule);
require("./start/event")(eventEmitter);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => winston.info(`🚀 MicroFlame App listening on port ${port}...`));

module.exports = server;
