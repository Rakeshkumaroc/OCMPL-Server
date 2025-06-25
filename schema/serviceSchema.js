const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  serviceName: { type: String },
  work: { 
    workTitle:{ type: String },
     workUrl:{ type: String },
      workImg:{ type: String },
   }, 
  
  addedTime: { type: String },
});

module.exports = mongoose.model("service", serviceSchema);
