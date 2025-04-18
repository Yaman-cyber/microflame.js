const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.replace(/ /g, "_"));
  },
});

const upload = multer({
  dest: "public/uploads/",
  storage: storage,
});

module.exports = storage;
