const path = require("path");
const fs = require("fs");
const projectSchema = require("../schema/projectSchema");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getAllProjects = async (req, res, next) => {
  try {
    const result = await projectSchema.find();
    res.send(result);
  } catch (error) {
    next(new ApiError("Failed to fetch projects", 500));
  }
};

const addProject = async (req, res, next) => {
  try {
    const addedTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const data = {
      ...req.body,
      addedTime,
      imageUrl: req.file ? req.file.path : null,
    };

    const result = await projectSchema.create(data);
    res.status(201).send(result);
  } catch (error) {
    next(new ApiError("Failed to add project", 500));
  }
};

const editProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const result = await projectSchema.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (!result) return next(new ApiError("Project not found", 404));

    res.status(200).send(result);
  } catch (error) {
    next(new ApiError("Failed to update project", 500));
  }
};

const deleteProjects = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const projects = await projectSchema.find({ _id: { $in: ids } });

    const imageFilenames = projects
      .map((p) => p.imageUrl)
      .filter(Boolean)
      .map((url) => path.basename(url));

    for (const filename of imageFilenames) {
      const isUsedElsewhere = await projectSchema.exists({
        _id: { $nin: ids },
        imageUrl: new RegExp(filename),
      });

      if (!isUsedElsewhere) {
        const fullPath = path.join("uploads/project", filename);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    }

    const result = await projectSchema.deleteMany({ _id: { $in: ids } });
    res.status(200).json(new ApiResponse(200, "Projects deleted successfully", result));
  } catch (error) {
    next(new ApiError("Failed to delete projects", 500));
  }
};

const getSingleProject = async (req, res, next) => {
  try {
    const result = await projectSchema.findById(req.params.id);
    res.send(result);
  } catch (error) {
    next(new ApiError("Failed to fetch project", 500));
  }
};

module.exports = {
  getAllProjects,
  addProject,
  editProject,
  deleteProjects,
  getSingleProject,
};
