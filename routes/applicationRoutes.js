const express = require("express");
const router = express.Router();
const {addApplication,
  getApplications,
  editApplication,
  deleteApplications} = require("../controllers/applicationController");
const { resumeUpload } = require("../middleware/multer");

// Add Application (with resume upload)
router.post(
  "/add-application",
  resumeUpload.single("resume"),
  addApplication
);

// Get All Applications
router.get("/application", getApplications);

// Edit Application (status or assignUser update)
router.put("/edit-application/:id", editApplication);

// Delete Multiple Applications (with resume file cleanup)
router.delete("/select-application-delete", deleteApplications);

module.exports = router;
