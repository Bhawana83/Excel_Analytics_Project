const mongoose = require('mongoose');
const User = require('../models/User');
const Upload = require('../models/Upload');
const { getGFSBucket } = require('../utils/gridfsBucket');
const bcrypt = require('bcryptjs');

let gfsBucket = null;
setTimeout(() => {
  gfsBucket = getGFSBucket();
}, 3500);


// ✅ Create new user (role = user only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // ✅ force user role
      status: "active",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error in createUser controller..." });
  }
};

// ✅ Update user details
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, status, isBlocked } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent changing role to admin/superadmin
    if (user.role !== "user") {
      return res.status(403).json({ message: "Cannot edit non-user accounts" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (status) user.status = status;
    if (typeof isBlocked !== "undefined") user.isBlocked = isBlocked;

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      updateUser: user,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Check Admin status pending or active
exports.checkAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("role status");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ role: user.role, status: user.status });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ updatedAt: -1 });
    res.json({
      message: "Admin get all user details successfully",
      count: `Total Users : ${users.length}`,
      users,
    });
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
    // Get user uploads
    const uploads = await Upload.find({ owner: user._id }).sort({
      updatedAt: -1,
    });

    res.json({ message: `${user.name} user details`, user, uploads });
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
    const userId = req.params.id;

    // 1. Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Find uploads belonging to this user
    const uploads = await Upload.find({ owner: userId });
    for (let file of uploads) {
      try {
        await gfsBucket.delete(new mongoose.Types.ObjectId(file.gridFsId));
      } catch (err) {
        console.warn(
          `Failed to delete GridFS file ${file.gridFsId}:`,
          err.message
        );
      }
    }

    // Remove Upload model entries
    await Upload.deleteMany({ owner: userId });

    // 3. Finally, delete the user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: "User and all their files deleted successfully",
    });
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
      success: true,
      message: `User : ${user.name} is now ${
        user.isBlocked ? "blocked" : "unblocked"
      }`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in toggleBlockUser Controllers",
      error: error.message,
    });
  }
};

exports.getSummaryStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const totalUploads = await Upload.countDocuments(); // if Upload model used

    res.json({
      totalUsers,
      blockedUsers,
      totalUploads,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Error in getSummaryStats Controllers",
      error: error.message,
    });
  }
};
