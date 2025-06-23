const path = require("path");
const fs = require("fs");
const jobApplicationSchema = require("../schema/jobApplicationSchema");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const addApplication = async (req, res, next) => {
  try {
    const addedTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const data = {
      ...req.body,
      addedTime,
      resume: req.file ? req.file.path : null,
    };

    const result = await jobApplicationSchema.create(data);
    res.status(201).json(new ApiResponse(201, "Application submitted", result));
  } catch (error) {
    next(new ApiError("Failed to add application", 500));
  }
};

const getApplications = async (req, res, next) => {
  try {
    const result = await jobApplicationSchema.find();
    res.send(result);
  } catch (error) {
    next(new ApiError("Failed to fetch applications", 500));
  }
};

const editApplication = async (req, res, next) => {
  try {
    const result = await jobApplicationSchema.updateOne(
      { _id: req.params.id },
      { $set: { status: req.body.status, assignUser: req.body.assignUser } }
    );
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const deleteApplications = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const applications = await jobApplicationSchema.find({ _id: { $in: ids } });

    for (const app of applications) {
      if (app.resume) {
        const resumePath = path.join(__dirname, "../", app.resume);
        if (fs.existsSync(resumePath)) fs.unlinkSync(resumePath);
      }
    }

    const result = await jobApplicationSchema.deleteMany({ _id: { $in: ids } });
    res.json(new ApiResponse(200, "Applications deleted", result));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addApplication,
  getApplications,
  editApplication,
  deleteApplications,
};
