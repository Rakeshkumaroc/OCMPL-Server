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

    const updateData = {
      ...req.body,
      addedTime,
    };

    // Add uploaded image path to work.workImg
    if (req.files?.workImg) {
      updateData.work = {
        ...updateData.work,
        workImg: req.files.workImg[0].path,
      };
    }

    const result = await serviceSchema.create(updateData);
    res
      .status(201)
      .json(new ApiResponse(201, "Service added successfully", result));
  } catch (error) {
    next(new ApiError("Failed to add service", 500));
  }
};

const editService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
    };

    if (req.files?.workImg) {
      updateData.work = {
        ...updateData.work,
        workImg: req.files.workImg[0].path,
      };
    }

    const result = await serviceSchema.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Service updated successfully", result));
  } catch (error) {
    next(new ApiError("Failed to edit service", 500));
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
          "work.workImg": new RegExp(filename),
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
