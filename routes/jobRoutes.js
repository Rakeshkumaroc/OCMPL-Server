const express = require("express");
const router = express.Router();
const {
  addJob,
  getJobs,
  getSingleJob,
  editJob,
  deleteJobs,
} = require("../controllers/jobController");

router.post("/add-job", addJob);
router.get("/job", getJobs);
router.get("/single-job/:id", getSingleJob);
router.put("/edit-job/:id", editJob);
router.delete("/select-job-delete", deleteJobs);

module.exports = router;
