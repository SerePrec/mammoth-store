import multer from "multer";
import config from "../config.js";
import { logger } from "../logger/index.js";

const maxFileSize = 1000000;

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadsImg.productsPath);
  },
  filename: function (req, file, cb) {
    const prefix = Date.now();
    const filenameNoSpaces = file.originalname.replace(/[ ]/g, "_");
    cb(null, prefix + "-" + filenameNoSpaces);
  }
});
const productUpload = multer({ storage: productStorage });

const uploadProductImage = productUpload.single("imageFile");

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadsImg.avatarsPath);
  },
  filename: function (req, file, cb) {
    const prefix = Date.now();
    const filenameNoSpaces = file.originalname.replace(/[ ]/g, "_");
    cb(null, prefix + "-" + filenameNoSpaces);
  }
});
const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: maxFileSize }
});

const uploadAvatarImage = avatarUpload.single("imageFile");

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.error(err);
    res.redirect("back");
  } else {
    next(err);
  }
};

export { uploadProductImage, uploadAvatarImage, multerErrorHandler };
