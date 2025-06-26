const path = require("path");
const fs = require("fs");
const jobApplicationSchema = require("../schema/jobApplicationSchema");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const addApplication = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, position } = req.body;
    if (!firstName || !lastName || !email || !phone || !position) {
      throw new ApiError("Required fields are missing", 400);
    }

    const addedTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const data = {
      ...req.body,
      addedTime,
      resume: req.file ? req.file.path : null,
    };

    const result = await jobApplicationSchema.create(data);
    res.status(201).json(new ApiResponse(201, "Application submitted successfully", result));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError("Failed to add application", 500));
  }
};

const getApplications = async (req, res, next) => {
  try {
    const result = await jobApplicationSchema.find();
    res.status(200).json(new ApiResponse(200, "Applications fetched successfully", result));
  } catch (error) {
    next(new ApiError("Failed to fetch applications", 500));
  }
};

const editApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assignUser } = req.body;

    if (!status && !assignUser) {
      throw new ApiError("Status or assignUser is required", 400);
    }
    if (status && !["Pending", "Responded", "Closed"].includes(status)) {
      throw new ApiError("Invalid status", 400);
    }

    const result = await jobApplicationSchema.findOneAndUpdate(
      { _id: id },
      { $set: { status, assignUser } },
      { new: true }
    );

    if (!result) {
      throw new ApiError("Application not found", 404);
    }

    res.status(200).json(new ApiResponse(200, "Application updated successfully", result));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError("Failed to update application", 500));
  }
};

const deleteApplications = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new ApiError("Invalid or empty IDs", 400);
    }

    const applications = await jobApplicationSchema.find({ _id: { $in: ids } });

    for (const application of applications) {
      if (application.resume) {
        const resumePath = path.join(__dirname, "..", application.resume);
        try {
          if (fs.existsSync(resumePath)) {
            fs.unlinkSync(resumePath);
            console.log("Deleted resume:", resumePath); // Debug
          }
        } catch (fileError) {
          console.error("Error deleting resume file:", fileError);
          // Continue deletion even if file deletion fails
        }
      }
    }

    const result = await jobApplicationSchema.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      throw new ApiError("No applications found to delete", 400);
    }

    res.status(200).json(new ApiResponse(200, "Applications deleted successfully", result));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError("Failed to delete applications", 500));
  }
};

module.exports = {
  addApplication,
  getApplications,
  editApplication,
  deleteApplications,
};