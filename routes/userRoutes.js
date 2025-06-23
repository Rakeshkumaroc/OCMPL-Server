const express = require("express");
const router = express.Router();
const {
  addUser,
  loginUser,
  getSingleUser,
  updateUser,
  getAllUsers,
  deleteSelectedUsers,
}= require("../controllers/userController");

// User Routes
router.post("/add-user", addUser);
router.post("/login-user", loginUser);
router.get("/single-user/:id", getSingleUser);
router.put("/edit-user/:id", updateUser);
router.get("/admin", getAllUsers);
router.delete("/select-user-delete", deleteSelectedUsers);

module.exports = router;
