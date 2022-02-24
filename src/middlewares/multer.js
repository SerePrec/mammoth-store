import multer from "multer";
import config from "../config.js";

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

export const uploadProductImage = productUpload.single("imageFile");

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
const avatarUpload = multer({ storage: avatarStorage });

export const uploadAvatarImage = avatarUpload.single("imageFile");
