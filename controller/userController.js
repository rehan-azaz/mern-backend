import crypto from "crypto";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../model/userModel.js";
import sendToken from "../middleware/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";

const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;

  const user = await User.create({
    first_name,
    last_name,
    email,
    password,
    image: {
      id: "0",
      url: "/user.png",
    },
  });

  sendToken(user, 201, res);
});

const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Wrong Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Wrong Email or Password", 401));
  }

  sendToken(user, 200, res);
});

const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out.",
  });
});

const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/password/reset/${resetToken}`;

  const message = `Please reset your password here: \n\n ${resetPasswordURL} \n\n If you have not requested this please ignore.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Recover Your Password",
      message,
    });

    res.status(200).send({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset password URL is invalid or expire", 400)
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

const getUserInfo = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: true,
    user,
  });
});

const updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

  if(!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  if(req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  
  const newUserData = {
    first_name: req.body.first_name,
    email: req.body.email,

  } 

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });
  
  res.json({
    success: true,
    user
  })

});

export default {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserInfo,
  updateUserPassword,
  updateUserProfile
};
