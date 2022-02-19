import multer from "multer";
import config from "../config.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadsImg.path);
  },
  filename: function (req, file, cb) {
    const prefix = Date.now();
    const filenameNoSpaces = file.originalname.replace(/[ ]/g, "_");
    cb(null, prefix + "-" + filenameNoSpaces);
  }
});
const upload = multer({ storage });

export const uploadProductImage = upload.single("imageFile");
