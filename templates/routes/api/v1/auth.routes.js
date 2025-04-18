const express = require("express");
const router = express.Router();
const api = require("../../../controllers/api/v1/auth.controller");

router.post("/login", api.logIn);

router.post("/signup", api.signup);

module.exports = router;
