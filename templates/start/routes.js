const express = require("express");
const cors = require("cors");

const response = require("../middlewares/response");
const error = require("../middlewares/error");
const notFound = require("../middlewares/404");
const language = require("../middlewares/language");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));
  app.use(language);

  app.set("view engine", "ejs");

  app.use("/", require("../routes/views"));
  app.use("/api", require("../routes/api"));

  app.use(response);
  app.use(notFound);
  app.use(error);
};
