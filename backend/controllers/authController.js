//here we will create all the controller function like login logout

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User');


// Generate JWT Token yh
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "12h" });
};


//registration controller function
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ Success: false, message: "All details are necessary" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ Success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userr = await User.create({ name, email, password: hashedPassword });
    // console.log(userr);

    const token = jwt.sign({ id: userr._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // me abhi kuch code ko comment kr rha hena
    //   res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    return res.json({ success: true, userr, token }); // token ban rha hai ya nhi ye dkehne ke liye esko bhi bhej diya
  } catch (error) {
    res.json({ Success: false, message: error.message });
  }
};

//login controller function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      Success: false,
      message: "Email and Password are required",
    });
  }
  try {
    // yhan hai dikat dekh model ka name aur vairbale name dono same hai, dono ke name alg hone chaiye tu kuch acha menaingful name de skti hia register me cretedUser ese
    const userr = await User.findOne({ email });
    if (!userr) {
      return res.json({ success: false, message: "Invalid email" });
    }
    const isMatch = await bcrypt.compare(password, userr.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ id: userr._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    return res.json({ success: true, userr, token });
  } catch (error) {
    return res.json({ success: false, message: error.message });
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

//if user is authenticated
// const isAuthenticated = async (req, res) => {
//   try {
//     return res.json({ success: true });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// Get User Info Controller yh
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

