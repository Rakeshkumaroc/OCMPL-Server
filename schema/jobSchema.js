const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  workMode: {
    type: [String],
    enum: ["Remote", "On-site", "Hybrid"], 
  },
  jobType: {
    type: [String],
    enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"], 
  },
  addedTime: { type: String },
});

module.exports = mongoose.model("Job", jobSchema);
