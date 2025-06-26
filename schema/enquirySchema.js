const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  services: { type: String }, 
   subject: { type: String }, 
  message: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Responded", "Closed"],
    default: "Pending",
  },
  assignUser: {
    type: [String],
    enum: ["Admin", "Content", "Sales"],
    default: ["Admin"],
  },
  addedTime: { type: String },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
