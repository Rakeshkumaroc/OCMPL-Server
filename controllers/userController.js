const User = require("../schema/userSchema");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const addUser = async (req, res, next) => {
  try {
    console.log(req.body)
    const { username, email, number, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError("User already exists with this email", 400));
    }

    const newUser = new User({
      username,
      email,
      number,
      password,
    });

    await newUser.save();
    res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully", newUser));
  } catch (error) {
    next(new ApiError(error.message || "Server error", 500));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (!user) {
      return next(new ApiError("Invalid Information", 401));
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Login successful", user));
  } catch (error) {
    next(new ApiError(error.message || "Login failed", 500));
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res
      .status(200)
      .json(new ApiResponse(200, "User fetched successfully", user));
  } catch (error) {
    next(new ApiError(error.message || "Failed to fetch user", 500));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    res
      .status(200)
      .json(new ApiResponse(200, "User updated successfully", result));
  } catch (error) {
    next(new ApiError(error.message || "Failed to update user", 500));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json(new ApiResponse(200, "All users fetched", users));
  } catch (error) {
    next(new ApiError(error.message || "Failed to fetch users", 500));
  }
};

const deleteSelectedUsers = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const result = await User.deleteMany({ _id: { $in: ids } });

    res
      .status(200)
      .json(new ApiResponse(200, "Users deleted successfully", result));
  } catch (error) {
    next(new ApiError(error.message || "Failed to delete users", 500));
  }
};

module.exports = {
  addUser,
  loginUser,
  getSingleUser,
  updateUser,
  getAllUsers,
  deleteSelectedUsers,
};
