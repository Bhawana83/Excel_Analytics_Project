const User = require("../models/User");
const Upload = require("../models/Upload");
const bcrypt = require("bcryptjs");

// 📌 Get all admins with their status (pending, active, rejected)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ updatedAt: -1 }); // ✅ latest registered user

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in getAllUsers Controller : ",
      error: error.message,
    });
  }
};

// 📌 Get all admins with their status (pending, active, rejected)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ updatedAt: -1 }); // ✅ latest registered user

    res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in getAllAdmins Controller : ",
      error: error.message,
    });
  }
};

// ✅ Approve admin
exports.approveAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    if (adminUser.role !== "admin") {
      return res.status(400).json({ message: "Not an admin request..." });
    }

    adminUser.status = "active";
    await adminUser.save();

    res.status(200).json({
      success: true,
      message: "Admin approved Successfully",
      adminUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in approveAdmin Controller : ",
      error: error.message,
    });
  }
};

// ❌ Reject Admin
exports.rejectAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const adminUser = await User.findById(adminId);
    if (!adminUser) return res.statu(404).json({ message: "Admin not found" });

    if (adminUser.role !== "admin") {
      return res.status(400).json({ message: "Not an admin request" });
    }

    // adminUser.role = "user";
    adminUser.status = "rejected";
    await adminUser.save();

    res.status(200).json({
      success: true,
      message: "Admin rejected successfully...",
      adminUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in rejectAdmin Controller : ",
      error: error.message,
    });
  }
};

// ✅ Create User or Admin (SuperAdmin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Restrict role assignment
    if (role && !["user", "admin"].includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role assignment" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default user
      status: "active", // admins might need approval flow
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ Update User or Admin (SuperAdmin only)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password, role, status, isBlocked } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Prevent touching superadmin
    if (user.role === "superadmin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot modify Super Admin!" });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // SuperAdmin can update role but only user/admin
    if (role && ["user", "admin"].includes(role)) {
      user.role = role;
    }

    if (status) user.status = status; // active/pending/rejected
    if (typeof isBlocked !== "undefined") {
      user.isBlocked = isBlocked;
    }

    await user.save();

    res.json({ success: true, message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ Delete a User or Admin (SuperAdmin only)
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
    await User.findByIdAndDelete(userId, {
      deleted: true,
      deletedAt: new Date(),
    });

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

// ✅ Block or unblock a User or Admin (SuperAdmin only)
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

// ✅ Get one user by ID
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional : Get their uploads
    // Here - upload model should be defined and related to user
    // Get user uploads
    const uploads = await Upload.find({ owner: user._id, deleted: false }).sort({
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

// ✅ Get one admin by ID
exports.getAdminDetails = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional : Get their uploads
    // Here - upload model should be defined and related to admin
    // Get admin uploads
    const uploads = await Upload.find({ owner: admin._id, deleted: false }).sort({
      updatedAt: -1,
    });

    res.json({ message: `${admin.name} admin details`, admin, uploads });
  } catch (error) {
    res.status(500).json({
      message: "Error in getAdminDetails Controllers",
      error: error.message,
    });
  }
};