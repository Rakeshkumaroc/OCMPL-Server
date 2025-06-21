const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
});

const AdditionalContentSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
});

const serviceSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  icon: { type: String }, // Store icon path or reference
  paragraphs: [{ type: String }],
  heroImage: { type: String }, // URL of main image
  additionalContentImage:{ type: String },
  featuresImage:{ type: String },
  features: [FeatureSchema],
  additionalContent: [AdditionalContentSchema],
  addedTime: { type: String },
});

module.exports = mongoose.model("service", serviceSchema);
