const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  serviceName: { type: String },
  imageUrl: { type: String }, // Store image path or URL
  href: { type: String }, // Project link 
  addedTime: { type: String },
  floticon: { type: String }, // Store floticon as a string (e.g., path or identifier)
  otherProjects: [
    {
      title: { type: String },
      category: { type: String },
      imageUrl: { type: String },
      link: { type: String },
    },
  ],
});

module.exports = mongoose.model("newproject", projectSchema);