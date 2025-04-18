const fs = require("fs");
const sharp = require("sharp");
const multer = require("multer");

const storage = require("../../helpers/storage");
const responseCodes = require("../../constants/responseCodes.json");
const messages = require("../../constants/messages.json");

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else {
    req.fileValidationError = true;

    cb(null, false, req.fileValidationError);
  }
};

const validate = (allowedTypes) => (req, res, next) => {
  const lang = req.lang;

  if (req.fileValidationError)
    return res.status(responseCodes.badRequest).send({
      date: null,
      success: false,
      message: messages[lang].fileTypeNotAllowed + " " + allowedTypes,
    });

  next();
};

const imageSize = (maxWidth, maxHeight) => async (req, res, next) => {
  const lang = req.lang;

  if (!req.file)
    return res.status(responseCodes.badRequest).json({
      data: null,
      success: false,
      message: messages[lang].fileRequired,
    });

  const metadata = await sharp(req.file.path).metadata();

  if (metadata.width <= maxWidth && metadata.height <= maxHeight) {
    next();
  } else {
    fs.unlinkSync(req.file.path);

    return res.status(responseCodes.badRequest).json({
      data: null,
      success: false,
      message: `Image dimensions exceed ${maxWidth}x${maxHeight}`,
    });
  }
};

const preDefinedSizes = (allowedSizes) => async (req, res, next) => {
  const lang = req.lang || "en";

  if (!req.file) {
    return res.status(responseCodes.badRequest).json({
      data: null,
      success: false,
      message: messages[lang].fileRequired,
    });
  }

  const metadata = await sharp(req.file.path).metadata();

  // Check if the image size matches one of the allowed sizes exactly
  const isValidSize = allowedSizes.some((size) => metadata.width === size.width && metadata.height === size.height);

  if (isValidSize) {
    next();
  } else {
    fs.unlinkSync(req.file.path);
    return res.status(responseCodes.badRequest).json({
      data: null,
      success: false,
      message: `Image dimensions should be in ${allowedSizes.map((ele) => `${ele.width}X${ele.height}`)}`,
    });
  }
};

const checkFileCount = (min, max) => (req, res, next) => {
  const fileCount = req.files ? req.files.length : req.file ? 1 : 0;

  if (fileCount < min) {
    return res.status(responseCodes.badRequest).json({
      data: null,
      success: false,
      message: `At least ${min} images are required.`,
    });
  }

  if (fileCount > max) {
    return res.status(responseCodes.badRequest).json({
      data: null,
      success: false,
      message: `No more than ${max} images are allowed.`,
    });
  }

  next();
};

const upload = (fileFilter) =>
  multer({
    dest: "public/uploads/",
    storage: storage,
    fileFilter,
  });

module.exports = {
  checkFileCount,
  fileFilter,
  preDefinedSizes,
  imageSize,
  validate,
  upload,
};
