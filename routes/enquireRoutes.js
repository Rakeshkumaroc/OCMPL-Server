const express = require("express");
const router = express.Router();
const  {
  addEnquiry,
  getAllEnquiries,
  editEnquiry,
  deleteSelectedEnquiries,
} = require("../controllers/enquiryController");

router.post("/add-enquiry", addEnquiry);
router.get("/enquiry", getAllEnquiries);
router.put("/edit-enquiry/:id", editEnquiry);
router.delete("/select-enquiry-delete", deleteSelectedEnquiries);

module.exports = router;
