const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const outputFolder = "public/uploads";

module.exports = async (req, res, next) => {
  let files = [];

  if (req.files && req.files.length !== 0) {
    const resizePromises = req.files.map(async (file) => {
      await sharp(file.path)
        .resize(2000)
        .jpeg({ quality: 30 })
        .toFile(path.resolve(outputFolder, file.filename + "_full.jpg"));

      fs.unlinkSync(file.path);

      files.push({
        filename: file.filename + "_full.jpg",
        path: path.resolve(outputFolder, file.filename + "_full.jpg"),
      });
    });

    await Promise.all([...resizePromises]);

    req.files = files;
  }

  next();
};
