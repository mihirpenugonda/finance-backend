const User = require("../models/userModel");
const catchAsyncErrors = require("../middleware/asyncErrorMiddleware");
const ErrorHandler = require("../utils/errorHandler");
const { sendToken } = require("../utils/sendToken");
const router = require("../routes/userRoutes");
const ApiFeatures = require("../utils/apiFeatures");
const mongoose = require("mongoose");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, username, password, email } = req.body;

  const user = await User.create({
    name,
    username,
    password,
    email,
    avatar: {
      public_id: "null",
      url: "null",
    },
  });

  sendToken(user, 200, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new ErrorHandler("wrong username and password", 404));

  const isMatch = await user.matchPassword(password);

  if (!isMatch)
    return next(new ErrorHandler("wrong username or password", 401));

  user["password"] = null;

  sendToken(user, 200, res);
});

exports.findUsers = catchAsyncErrors(async (req, res, next) => {
  if (req.query.user_id == undefined) {
    return next(new ErrorHandler("invalid api call", 401));
  } else if (req.query.user_id != 0) {
    getUserById(req, res, next);
  } else if (req.query.user_id == 0) {
    getAllUsers(req, res, next);
  }
});

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.requestor_id);
  if (!user) return next(new ErrorHandler("user not found", 404));

  res.status(200).json({
    success: true,
    user: user,
  });
});

exports.editUser = catchAsyncErrors(async (req, res, next) => {
  const { username, email, avatar } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: req.requestor_id },
    {
      $set: {
        username: username,
        email: email,
        avatar: avatar,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    user: user.new,
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { password, new_password } = req.body;

  let user = null;
  if ((process.env.STATUS = "TEST")) {
    user = await User.findById(req.body.id).select("+password");
  } else {
    user = await User.findById(req.requestor_id).select("+password");
  }

  if (!user)
    return next(new ErrorHandler("user does not exist - invalid token", 404));

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(
      new ErrorHandler("wrong password - please enter correct password", 403)
    );
  }

  user.password = new_password;
  user.save();

  res.status(200).json({
    success: true,
  });
});

// admin routes
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, {
    $set: {
      role: "admin",
    },
  });

  res.status(200).json({
    success: true,
  });
});

getUserById = async (req, res, next) => {
  const user = await User.findById(req.query.user_id);
  console.log(user);

  if (!user) return next(new ErrorHandler("user not found", 404));

  res.status(200).json({
    success: true,
    users: [user],
  });
};

getAllUsers = async (req, res, next) => {
  const apiFeatures = new ApiFeatures(User.find(), req.query).search();

  const users = await apiFeatures.queryData;

  res.status(200).json({
    success: true,
    users: users,
  });
};
