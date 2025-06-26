const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

const createStorage = (folderPath, rename = true) => {
  ensureDir(folderPath);
  return multer.diskStorage({
    destination: (_, file, cb) => {
      const destination =
        file.fieldname === "floticon" ? "uploads/floticon" : folderPath;
      ensureDir(destination);
      cb(null, destination);
    },
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
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only JPG and PNG files are allowed"), false);
      }
    },
  }).fields([
    { name: "imageUrl", maxCount: 1 },
    { name: "floticon", maxCount: 1 },
    { name: "otherProjectImage_0", maxCount: 1 },
    { name: "otherProjectImage_1", maxCount: 1 },
    { name: "otherProjectImage_2", maxCount: 1 },
    // Add more as needed for additional otherProjects
  ]),
};