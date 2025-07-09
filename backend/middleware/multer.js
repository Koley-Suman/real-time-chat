import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = 'upload/';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/'); // folder to store files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // rename file
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  // limits: { fileSize: 2 * 1024 * 1024 }, // Optional: 2MB limit
});