const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto-js");
const cloudinary = require("cloudinary");

//Register a User
exports.registerUser = asyncHandler(async (req, res) => {
  console.log("Starting user registration process");
  //console.log('Request body:', req.body);
  const { name, email, password, avatar } = req.body;

  try {
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      crop: "scale",
      width: 150,
    });
    console.log("Cloudinary upload successful:", myCloud);

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    
    if (!user) {
      return res.status(500).json({ message: "User creation failed" });
    }

    sendToken(user, 201, res);
  } catch (error) {
    console.error("Cloudinary upload error:", error);
  }
});
//Login a User
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //check if both email and password are present
  if (!email || !password) {
    res.status(401);
    throw new Error("Please Enter email & password");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or passsword");
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    res.status(401);
    throw new Error("Invalid email or passsword");
  }

  sendToken(user, 200, res);
});

//LogOut a User
exports.logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expiresIn: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out Successfully",
  });
});

//Forgot Password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error("User not Found");
  }
  //console.log(user)

  //Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `http://localhost:3000/password/reset/${resetToken}`;

  const message = `Your password reset url is:-\n\n ${resetPasswordUrl} \n\n If you have not requested this email ,please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: "Email sent",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error(error.message);
  }
});

//RESET PASSWORD
exports.resetPassword = asyncHandler(async (req, res) => {
  //creating token hash
  const resetPasswordToken = crypto.SHA256(token).toString(crypto.enc.Hex);
    console.log(resetPasswordToken)


    const user = await User.findOne({
      resetPasswordToken:req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    });
  console.log("user",user)
  if (!user) {
    res.status(400);
    throw new Error("Reset Password token is invalid/expired");
  }
  //console.log(user)
  if (req.body.password != req.body.confirmPassword) {
    res.status(400);
    throw new Error("Password does not match");
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  sendToken(user, 200, res);
});

//GET User Details
exports.getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// update user password
exports.updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    res.status(401);
    throw new Error("Old password is incorrect");
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    res.status(400);
    throw new Error("Password doesnt match");
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//Update user profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);


      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        crop: "scale",
        width: 150,
      });
      newUserData.avatar={
        public_id: myCloud.public_id,
        url: myCloud.url,
      }
    }
 
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAnsModify: false,
    });

    res.status(200).json({
      success: true,
    });
  }
);

//Get all users (admin)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//GET SINGLE  USER (ADMIN)
exports.getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User does  not exist");
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Update user role --> admin
exports.updateRole = asyncHandler(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  
   await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAnsModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//Delete user -->admin

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);



  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
