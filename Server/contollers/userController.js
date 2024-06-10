const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");

// const secretKey = crypto.randomBytes(32).toString("hex");
// console.log(secretKey);

const User = require("../models/UserSchema");

//REGISTER LOGIC
const userSignup = async (req, role, res) => {
  try {
    // Get user from database with same fullName if any
    const validateUserfullName = async (fullName) => {
      let checkUser = await User.findOne({ fullName });
      return checkUser ? false : true;
    };

    // Get user from database with same email if any
    const validateEmail = async (email) => {
      let checkUser = await User.findOne({ email });
      return checkUser ? false : true;
    };

    // Validate the fullName
    let fullNameNotTaken = await validateUserfullName(req.fullName);
    if (!fullNameNotTaken) {
      return res.status(400).json({
        message: `User fullName is already taken.`,
      });
    }

    // Validate the email
    let emailNotRegistered = await validateEmail(req.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
      });
    }

    // Validate the password
    const validatePassword = (password) => {
      // Add your password validation logic here
      // For example:
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    };

    if (!validatePassword(req.password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    // Hash password using bcrypt
    const password = await bcrypt.hash(req.password, 12);

    // Define the permissions for each role
    const permissions = {
      admin: ['create', 'read', 'update', 'delete'],
      stockControl: ['read', 'update'],
      employee: ['read'],
    };

    // Create a new user
    const newUser = new User({
      ...req,
      password,
      role,
      permissions: permissions[role],
    });

    await newUser.save();

    return res.status(201).json({
      message: 'You are successfully registered. Please log in.',
    });
  } catch (err) {
    // Implement logger function if any
    return res.status(500).json({
      message: `${err.message}`,
    });
  }
};


//LOGIN LOGIC

const userLogin = async (req, res) => {
  console.log('Request Body:', req.body);
  let { email, password } = req.body;

  // First Check if the user exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: 'User email is not found. Invalid login credentials.',
      success: false,
    });
  }

  // Check if the user is logging in via the route for their department
  if (user.role !== req.params.role) {
    return res.status(403).json({
      message: 'Please make sure you are logging in from the right portal.',
      success: false,
    });
  }

  // Check if the password matches
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // Sign a token and issue it to the user
    let token = jwt.sign(
      {
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        permissions: user.permissions, // Add the user's permissions to the token
      },
      process.env.APP_SECRET,
      { expiresIn: '3 days' }
    );

    let result = {
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      permissions: user.permissions, // Return the user's permissions in the response
      token: `Bearer ${token}`,
      expiresIn: 168,
    };

    return res.status(200).json({
      ...result,
      message: 'You are now logged in.',
    });
  } else {
    return res.status(403).json({
      message: 'Incorrect password.',
    });
  }
};

//LOGOUT LOGIC
const userLogout = (req, res) => {
  // Clear the token or any session information
  res.clearCookie('token');
  return res.status(200).json({
    message: 'You have been logged out successfully.',
    success: true,
  });
};

//FORGET PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User with this email does not exist.',
        success: false,
      });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration

    await user.save();

    // TODO: Send the reset password email

    return res.status(200).json({
      message: 'Password reset instructions have been sent to your email address.',
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occurred while processing the request.',
      success: false,
    });
  }
};

module.exports = { userSignup, userLogin, userLogout, forgotPassword };
