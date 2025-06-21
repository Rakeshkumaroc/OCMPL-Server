const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
  },
  currentLocation: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  portfolio: {
    type: String,
  },
  
  resume: {
    type: String, // Assuming resume is stored as a URL or file path
  },
  coverLetter: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Responded", "Closed"],
    default: "Pending",
  },
 
  addedTime: { type: String },
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
