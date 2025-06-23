// utils/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

const createStorage = (folderPath, rename = true) => {
  ensureDir(folderPath);
  return multer.diskStorage({
    destination: (_, __, cb) => cb(null, folderPath),
    filename: (_, file, cb) =>
      cb(null, rename ? Date.now() + path.extname(file.originalname) : file.originalname),
  });
};

module.exports = {
  resumeUpload: multer({ storage: createStorage("uploads/resume") }),
  serviceUpload: multer({
    storage: createStorage("uploads/service", false),
  }),
  projectUpload: multer({
    storage: createStorage("uploads/project", false),
  }),
};
