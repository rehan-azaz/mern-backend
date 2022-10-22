import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please Enter First Name."],
    maxLength: [30, "First name cannot exceed 30 characters"],
    minLength: [1, "Last name should have more than 1 characters"],
  },

  last_name: {
    type: String,
    required: [true, "Please Enter Last Name."],
    maxLength: [30, "Last name cannot exceed 30 characters"],
    minLength: [1, "Last name should have more than 1 characters"],
  },

  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validator: [validator.isEmail, "Please Enter a valid email."],
  },

  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters."],
    select: false,
  },

  image: {
    id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  role: {
    type: String,
    default: "admin",
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Encrypt Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Paswword Reset Token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("user", userSchema);

export default User;
