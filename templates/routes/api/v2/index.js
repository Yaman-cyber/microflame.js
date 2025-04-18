const fs = require("fs");
const express = require("express");
const router = express.Router();

fs.readdirSync(__dirname).forEach((file) => {
  if (file.indexOf("index") === -1) {
    const routeName = file.split(".")[0];
    router.use(`/${routeName}`, require(`./${file}`));
  }
});

module.exports = router;
