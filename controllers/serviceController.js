const path = require("path");
const fs = require("fs");
const serviceSchema = require("../schema/serviceSchema");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getAllServices = async (req, res, next) => {
  try {
    const result = await serviceSchema.find();
    res.status(200).json(new ApiResponse(200, "Services fetched", result));
  } catch (error) {
    next(new ApiError("Failed to fetch services", 500));
  }
};

const addService = async (req, res, next) => {
  try {
    const addedTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const { title, description, serviceName, workTitle, workUrl } = req.body;

    // Validate required fields
    if (!title || !description || !serviceName || !workTitle) {
      throw new ApiError(
        "Title, description, service name, and work title are required",
        400
      );
    }

    // Construct work object
    const work = {
      workTitle,
      workUrl: workUrl || "",
    };

    if (req.file) {
      work.workImg = path.join("uploads/service", req.file.filename).replace(/\\/g, "/");
    }

    const updateData = {
      title,
      description,
      serviceName,
      work,
      addedTime,
    };

    const result = await serviceSchema.create(updateData);
    res
      .status(201)
      .json(new ApiResponse(201, "Service added successfully", result));
  } catch (error) {
    next(
      new ApiError(
        error.message || "Failed to add service",
        error.status || 500
      )
    );
  }
};

const editService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, serviceName, workTitle, workUrl } = req.body;

    // Validate required fields
    if (!title || !description || !serviceName || !workTitle) {
      throw new ApiError(
        "Title, description, service name, and work title are required",
        400
      );
    }

    // Construct work object
    const work = {
      workTitle,
      workUrl: workUrl || "",
    };

    if (req.file) {
      work.workImg = path.join("uploads/service", req.file.filename).replace(/\\/g, "/");
    }

    const updateData = {
      title,
      description,
      serviceName,
      work,
    };

    const result = await serviceSchema.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!result) {
      throw new ApiError("Service not found", 404);
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Service updated successfully", result));
  } catch (error) {
    next(
      new ApiError(
        error.message || "Failed to update service",
        error.status || 500
      )
    );
  }
};

const deleteServices = async (req, res, next) => {
  try {
    const { ids } = req.body;

    const services = await serviceSchema.find({ _id: { $in: ids } });

    for (const service of services) {
      if (service.work?.workImg) {
        const filename = path.basename(service.work.workImg);
        const isUsed = await serviceSchema.exists({
          _id: { $nin: ids },
          "work.workImg": new RegExp(filename, "i"),
        });

        const fullPath = path.join("uploads/service", filename);
        if (!isUsed && fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    }

    const result = await serviceSchema.deleteMany({ _id: { $in: ids } });
    res
      .status(200)
      .json(new ApiResponse(200, "Services deleted successfully", result));
  } catch (error) {
    next(new ApiError("Failed to delete services", 500));
  }
};

const getSingleService = async (req, res, next) => {
  try {
    const result = await serviceSchema.findOne({ _id: req.params.id });
    res
      .status(200)
      .json(new ApiResponse(200, "Single service fetched", result));
  } catch (error) {
    next(new ApiError("Failed to fetch single service", 500));
  }
};

module.exports = {
  getAllServices,
  addService,
  editService,
  deleteServices,
  getSingleService,
};