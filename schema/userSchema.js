const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  number: { type: String },
  password: { type: String },
  userType: {
    type: String,
    enum: ["Admin", "Content", "Sales"],
  },
  addedTime: { type: String },
});

module.exports = mongoose.model("User", userSchema);
