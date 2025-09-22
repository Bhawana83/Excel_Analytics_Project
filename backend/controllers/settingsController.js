const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 📌 Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      message: "Error in getMe Controller : ",
      error: error.message,
    });
  }
};

// 📌 Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully ✅",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in updateProfile Controller : ",
      error: error.message,
    });
  }
};

// 📌 Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id, { new: true });
    res
      .status(200)
      .json({ success: true, message: "Account Deleted Successfully ✅" });
  } catch (error) {
    res.status(500).json({
      message: "Error in deleteAccount Controller : ",
      error: error.message,
    });
  }
};
