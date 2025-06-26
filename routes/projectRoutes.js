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

// Get all projects
router.get("/project", getAllProjects);

// Add a new project
router.post("/add-project", projectUpload, addProject);

// Edit a project
router.put("/edit-project/:id", projectUpload, editProject);

// Delete selected projects
router.delete("/select-project-delete", deleteProjects);

// Get a single project
router.get("/single-project/:id", getSingleProject);

module.exports = router;