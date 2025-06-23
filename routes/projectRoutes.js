const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  addProject,
  editProject,
  deleteProjects,
  getSingleProject,
} = require("../controllers/projectController");

const { projectUpload } = require("../middleware/multer");

router.get("/project", getAllProjects);

router.post("/add-project", projectUpload.single("imageUrl"), addProject);

router.put("/edit-project/:id", projectUpload.single("imageUrl"), editProject);

router.delete("/select-project-delete", deleteProjects);

router.get("/single-project/:id", getSingleProject);

module.exports = router;
