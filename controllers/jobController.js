const jobSchema = require("../schema/jobSchema");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const addJob = async (req, res, next) => {
  try {
    const addedTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const updateData = {
      ...req.body,
      addedTime,
    };

    const result = await jobSchema.insertMany(updateData);
    res.status(201).json(new ApiResponse(201, "Job added successfully", result));
  } catch (error) {
    next(new ApiError("Failed to add job", 500));
  }
};

const getJobs = async (req, res, next) => {
  try {
    const result = await jobSchema.find();
    res.status(200).json(new ApiResponse(200, "Jobs fetched successfully", result));
  } catch (error) {
    next(new ApiError("Failed to fetch jobs", 500));
  }
};

const getSingleJob = async (req, res, next) => {
  try {
    const result = await jobSchema.findOne({ _id: req.params.id });
    if (!result) {
      throw new ApiError("Job not found", 404);
    }
    res.status(200).json(new ApiResponse(200, "Job fetched successfully", result));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError("Failed to fetch job", 500));
  }
};

const editJob = async (req, res, next) => {
  try {
    const result = await jobSchema.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!result) {
      throw new ApiError("Job not found", 404);
    }
    res.status(200).json(new ApiResponse(200, "Job updated successfully", result));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError("Failed to update job", 500));
  }
};

const deleteJobs = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const result = await jobSchema.deleteMany({ _id: { $in: ids } });
    res.status(200).json(new ApiResponse(200, "Jobs deleted successfully", result));
  } catch (error) {
    next(new ApiError("Failed to delete jobs", 500));
  }
};

module.exports = {
  addJob,
  getJobs,
  getSingleJob,
  editJob,
  deleteJobs,
};