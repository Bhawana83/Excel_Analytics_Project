const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },

    //Add this field for role-based access
    // Add this field for role-based access
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user", // default user
    },

    status: {
      type: String,
      enum: ["active", "pending", "rejected"],
      default: "active", // default for normal users
    },
  },
  { timestamps: true }
);

//compare password
schema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", schema);
