const multer = require("multer");
const storage = require("../../helpers/storage");

const upload = multer({
  dest: "public/uploads/",
  storage: storage,
});

module.exports = upload;
