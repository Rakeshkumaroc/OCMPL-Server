const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    serviceName: { type: String },
    imageUrl: { type: String}, // Store image path or URL
    href: { type: String }, // Project link
    date: { type: Date},
  addedTime: { type: String },
});

module.exports = mongoose.model("project", projectSchema);
