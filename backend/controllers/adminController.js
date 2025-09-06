const mongoose = require('mongoose');
const User = require('../models/User');


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({ message: "Admin get all user details successfully", users });

  } catch (error) {
    res.status(500).json({
      message: "Error in getAllUsers Controllers",
      error: error.message,
    });
  }
};

// Get one user by ID
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional : Get their uploads
    // Here - upload model should be defined and related to user

    res.json({ message: `${user.name} user details`, user });
  } catch (error) {
    res.status(500).json({
      message: "Error in getUserDetails Controllers",
      error: error.message,
    });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); //function used to delete the user found by a particular id
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({
      message: "Error in deleteUser Controllers",
      error: error.message,
    });
  }
};

// Block or unblock a user
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked; // Toggle block status
    await user.save();

    res.json({
      message: `User : ${user.name} is now ${user.isBlocked ? "blocked" : "unblocked"}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in toggleBlockUser Controllers",
      error: error.message,
    });
  }
};

//get users summary
exports.getSummaryStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    // const totalUploads = await Upload.countDocuments(); // if Upload model used

    res.json({
      "Total Users ": totalUsers,
      "Total Blocked User":blockedUsers,
      //   totalUploads,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in getSummaryStats Controllers",
      error: error.message,
    });
  }
};