const express = require("express");
const router = express.Router();
const {
  getAllServices,
  addService,
  editService,
  deleteServices,
  getSingleService,
} = require("../controllers/serviceController");

const { serviceUpload } = require("../middleware/multer");

// Get all services
router.get("/service", getAllServices);

// Add a new service (upload only workImg)
router.post(
  "/add-service",
  serviceUpload.single("workImg"),
  addService
);

// Edit service (upload only workImg)
router.put(
  "/edit-service/:id",
  serviceUpload.single("workImg"),
  editService
);

// Delete selected services
router.delete("/select-service-delete", deleteServices);

// Get single service
router.get("/single-service/:id", getSingleService);

module.exports = router;
