const path = require("path");
const fs = require("fs");
const projectSchema = require("../schema/projectSchema");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getAllProjects = async (req, res, next) => {
  try {
    const result = await projectSchema.find();
    res.status(200).json(new ApiResponse(200, "Projects fetched", result));
  } catch (error) {
    next(new ApiError("Failed to fetch projects", 500));
  }
};

const addProject = async (req, res, next) => {
  try {
    const addedTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const { title, description, serviceName, href, otherProjects } = req.body;

    // Validate required fields
    if (!title || !description) {
      throw new ApiError("Title and description are required", 400);
    }

    // Parse otherProjects
    let parsedOtherProjects = [];
    if (otherProjects) {
      try {
        parsedOtherProjects = JSON.parse(otherProjects);
      } catch (e) {
        throw new ApiError("Invalid otherProjects format", 400);
      }
    }

    // Handle otherProjects images
    if (req.files) {
      parsedOtherProjects.forEach((project, index) => {
        const fileKey = `otherProjectImage_${index}`;
        if (req.files[fileKey]) {
          project.imageUrl = path
            .join("uploads/project", req.files[fileKey][0].filename)
            .replace(/\\/g, "/");
        }
      });
    }

    const data = {
      title,
      description,
      serviceName: serviceName || "",
      href: href || "",
      addedTime,
      otherProjects: parsedOtherProjects,
    };

    if (req.files && req.files.imageUrl) {
      data.imageUrl = path
        .join("uploads/project", req.files.imageUrl[0].filename)
        .replace(/\\/g, "/");
    }

    if (req.files && req.files.floticon) {
      data.floticon = path
        .join("uploads/floticon", req.files.floticon[0].filename)
        .replace(/\\/g, "/");
    }

    const result = await projectSchema.create(data);
    res
      .status(201)
      .json(new ApiResponse(201, "Project added successfully", result));
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      if (req.files.imageUrl) {
        fs.unlinkSync(
          path.join("uploads/project", req.files.imageUrl[0].filename)
        );
      }
      if (req.files.floticon) {
        fs.unlinkSync(
          path.join("uploads/floticon", req.files.floticon[0].filename)
        );
      }
      Object.keys(req.files).forEach((key) => {
        if (key.startsWith("otherProjectImage_")) {
          fs.unlinkSync(
            path.join("uploads/project", req.files[key][0].filename)
          );
        }
      });
    }
    next(
      new ApiError(
        error.message || "Failed to add project",
        error.status || 500
      )
    );
  }
};

const editProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, serviceName, href, otherProjects } = req.body;

    // Validate required fields
    if (!title || !description) {
      throw new ApiError("Title and description are required", 400);
    }

    // Parse otherProjects if provided as a JSON string
    let parsedOtherProjects = [];
    if (otherProjects) {
      try {
        parsedOtherProjects = JSON.parse(otherProjects);
      } catch (e) {
        throw new ApiError("Invalid otherProjects format", 400);
      }
    }

    // Get the existing project to check for old files
    const oldProject = await projectSchema.findById(id);
    if (!oldProject) {
      throw new ApiError("Project not found", 404);
    }

    const updateData = {
      title,
      description,
      serviceName: serviceName || "",
      href: href || "",
      addedTime: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
      otherProjects: parsedOtherProjects,
    };

    // Handle imageUrl
    if (req.files && req.files.imageUrl) {
      // Delete old image if it exists
      if (oldProject.imageUrl) {
        const oldFilename = path.basename(oldProject.imageUrl);
        const isUsedElsewhere = await projectSchema.exists({
          _id: { $ne: id },
          imageUrl: new RegExp(oldFilename, "i"),
        });
        const oldPath = path.join("uploads/project", oldFilename);
        if (!isUsedElsewhere && fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updateData.imageUrl = path
        .join("uploads/project", req.files.imageUrl[0].filename)
        .replace(/\\/g, "/");
    }

    // Handle floticon
    if (req.files && req.files.floticon) {
      // Delete old floticon if it exists
      if (oldProject.floticon) {
        const oldFilename = path.basename(oldProject.floticon);
        const isUsedElsewhere = await projectSchema.exists({
          _id: { $ne: id },
          floticon: new RegExp(oldFilename, "i"),
        });
        const oldPath = path.join("uploads/floticon", oldFilename);
        if (!isUsedElsewhere && fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updateData.floticon = path
        .join("uploads/floticon", req.files.floticon[0].filename)
        .replace(/\\/g, "/");
    }

    if (req.files) {
      parsedOtherProjects.forEach((project, index) => {
        const fileKey = `otherProjectImage_${index}`;
        if (req.files[fileKey]) {
          project.imageUrl = path
            .join("uploads/project", req.files[fileKey][0].filename)
            .replace(/\\/g, "/");
        }
      });
    }

    const result = await projectSchema.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!result) {
      throw new ApiError("Project not found", 404);
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Project updated successfully", result));
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      if (req.files.imageUrl) {
        fs.unlinkSync(
          path.join("uploads/project", req.files.imageUrl[0].filename)
        );
      }
      if (req.files.floticon) {
        fs.unlinkSync(
          path.join("uploads/floticon", req.files.floticon[0].filename)
        );
      }
      Object.keys(req.files).forEach((key) => {
        if (key.startsWith("otherProjectImage_")) {
          fs.unlinkSync(
            path.join("uploads/project", req.files[key][0].filename)
          );
        }
      });
    }
    next(
      new ApiError(
        error.message || "Failed to update project",
        error.status || 500
      )
    );
  }
};

const deleteProjects = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      throw new ApiError("Invalid or missing IDs", 400);
    }

    const projects = await projectSchema.find({ _id: { $in: ids } });

    for (const project of projects) {
      // Delete imageUrl
      if (project.imageUrl) {
        const filename = path.basename(project.imageUrl);
        const isUsed = await projectSchema.exists({
          _id: { $nin: ids },
          imageUrl: new RegExp(filename, "i"),
        });
        const fullPath = path.join("uploads/project", filename);
        if (!isUsed && fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
      // Delete floticon
      if (project.floticon) {
        const filename = path.basename(project.floticon);
        const isUsed = await projectSchema.exists({
          _id: { $nin: ids },
          floticon: new RegExp(filename, "i"),
        });
        const fullPath = path.join("uploads/floticon", filename);
        if (!isUsed && fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
      // Delete otherProjects images
      if (project.otherProjects && project.otherProjects.length > 0) {
        for (const otherProject of project.otherProjects) {
          if (otherProject.imageUrl) {
            const filename = path.basename(otherProject.imageUrl);
            const isUsed = await projectSchema.exists({
              _id: { $nin: ids },
              "otherProjects.imageUrl": new RegExp(filename, "i"),
            });
            const fullPath = path.join("uploads/project", filename);
            if (!isUsed && fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          }
        }
      }
    }

    const result = await projectSchema.deleteMany({ _id: { $in: ids } });
    res
      .status(200)
      .json(new ApiResponse(200, "Projects deleted successfully", result));
  } catch (error) {
    next(
      new ApiError(
        error.message || "Failed to delete projects",
        error.status || 500
      )
    );
  }
};

const getSingleProject = async (req, res, next) => {
  try {
    const result = await projectSchema.findById(req.params.id);
    console.log(result);
    
    if (!result) {
      throw new ApiError("Project not found", 404);
    }
    res
      .status(200)
      .json(new ApiResponse(200, "Single project fetched", result));
  } catch (error) {
    next(
      new ApiError(
        error.message || "Failed to fetch project",
        error.status || 500
      )
    );
  }
};

module.exports = {
  getAllProjects,
  addProject,
  editProject,
  deleteProjects,
  getSingleProject,
};
