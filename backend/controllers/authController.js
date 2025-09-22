//here we will create all the controller function like login logout

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User');


// Generate JWT Token yh
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "12h" });
};


//registration controller function
// Register Controller
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation: Check for missing fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if email is already exists or not
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    let status = "active"; // default

    if (role === "admin") {
      status = "pending"; // wait for super-admin approval
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status,
    });

    // console.log("User registered successfully:", user);

    // ye json ke sath parse send krni hai:   token: generateToken(user._id),
    res.status(201).json({
      success: true,
      message:
        role === "admin"
          ? "Admin request sent. Wating for super-admin approval"
          : "User registered Successfully...",
      user: {
        id: user._id,
        name,
        email,
        role,
        status,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in registerUser Controller : ",
      error: err.message,
    });
  }
};

//login controller function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validation: Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    // If User Not Exist
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Prevent Blocked users from logging in
    if (user.role === 'user' && user.isBlocked) {
      return res
        .status(403)
        .json({ message: "You are blocked by the admin. Contact support." });
    }

    // Prevent Pending admins from logging in
    if (user.role === "admin" && user.status === "pending") {
      return res.status(403).json({
        message: "Admin request pending approval by Super Admin",
      });
    }

    if (user.role === "admin" && user.status === "rejected") {
      return res
        .status(403)
        .json({ message: "Your admin request was rejected by Super Admin..." });
    }

    res.status(200).json({
      message: "User Login Successfully...",
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: `Error in loginUser Controller : ${error.message}`,
      error: error.message,
    });
  }
};
// ab chala

//logout controller function
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.josn({ success: false, message: error.message });
  }
};

// Get User Info Controller
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Error in Get User Controller : ",
      error: error.message,
    });
  }
};

exports.approvedLogin = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.status !== "active")
    return res.status(403).json({ message: "User not approved yet" });

  const token = generateToken(user); // whatever JWT method you use
  res.json({ token, user });
};
