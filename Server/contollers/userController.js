const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Role = require("../models/RoleSchema");
const User = require("../models/UserSchema");
const userAuth = require("../middlewares/auth");

const crypto = require("crypto");

// const secretKey = crypto.randomBytes(32).toString("hex");
// console.log(secretKey);

//REGISTER LOGIC
const userSignup = async (req, res) => {
  try {
    // Validate the fullName
    const fullNameExists = await User.findOne({ fullName: req.body.fullName });
    if (fullNameExists) {
      return res
        .status(400)
        .json({ message: "User fullName is already taken." });
    }

    // Validate the email
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Validate the password
    if (!validatePassword(req.body.password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Find the role
    const role = await Role.findOne({ module: req.body.role });
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    // Create a new user
    const newUser = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      role: role._id,
      permissions: role.permissions,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "User successfully registered. Please log in." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to register user." });
  }
};

//LOGIN LOGIC
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).populate("role");

    if (!user) {
      return res.status(404).json({
        message: "User email is not found. Invalid login credentials.",
      });
    }

    // Check if the user is logging in via the correct portal (role validation)
    if (user.role.module !== req.params.role) {
      return res.status(403).json({
        message: "Please make sure you are logging in from the right portal.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect password." });
    }

    // Sign JWT token
    const token = jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role.module,
        permissions: user.permissions,
      },
      process.env.APP_SECRET,
      { expiresIn: "3 days" }
    );

    return res.status(200).json({
      token: `Bearer ${token}`,
      expiresIn: 259200,
      message: "You are now logged in.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to log in user." });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has the necessary permissions to update their own profile
    if (
      req.user.id !== user._id.toString() &&
      !req.user.permissions.includes("update_user")
    ) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    // Update the user with the new information
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;

    // Check if the user is trying to update their role
    if (req.body.role && req.user.permissions.includes("update_user_role")) {
      const role = await Role.findOne({ module: req.body.role });
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      user.role = role._id;
      user.permissions = role.permissions;
    }

    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has the necessary permissions to delete the user
    if (!req.user.permissions.includes("delete_user")) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    await user.deleteOne();
    return res.json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//LOGOUT LOGIC
const userLogout = (req, res) => {
  // Clear the token or any session information
  res.clearCookie("token");
  return res.status(200).json({
    message: "You have been logged out successfully.",
    success: true,
  });
};

module.exports = { userSignup, userLogin, userLogout, updateUser, deleteUser };
