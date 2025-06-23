const Enquiry = require("../schema/enquirySchema");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const addEnquiry = async (req, res, next) => {
  try {
    const addedTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    const updateData = {
      ...req.body,
      addedTime,
    };

    const result = await Enquiry.insertMany(updateData);
    res.status(201).json(new ApiResponse(201, "Enquiry added successfully", result));
  } catch (error) {
    next(new ApiError(error.message || "Failed to add enquiry", 500));
  }
};

const getAllEnquiries = async (req, res, next) => {
  try {
    const result = await Enquiry.find();
    res.status(200).json(new ApiResponse(200, "All enquiries fetched", result));
  } catch (error) {
    next(new ApiError(error.message || "Failed to fetch enquiries", 500));
  }
};

const editEnquiry = async (req, res, next) => {
  try {
    const result = await Enquiry.updateOne(
      { _id: req.params.id },
      { $set: { status: req.body.status, assignUser: req.body.assignUser } }
    );
    res.status(200).json(new ApiResponse(200, "Enquiry updated successfully", result));
  } catch (error) {
    next(new ApiError(error.message || "Failed to update enquiry", 500));
  }
};

const deleteSelectedEnquiries = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const result = await Enquiry.deleteMany({ _id: { $in: ids } });
    res.status(200).json(new ApiResponse(200, "Enquiries deleted successfully", result));
  } catch (error) {
    next(new ApiError(error.message || "Failed to delete enquiries", 500));
  }
};

module.exports = {
  addEnquiry,
  getAllEnquiries,
  editEnquiry,
  deleteSelectedEnquiries,
};
