const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const crypto = require("crypto");

// const secretKey = crypto.randomBytes(32).toString("hex");
// console.log(secretKey);

const User = require("../models/UserSchema");

const userSignup = async (req, role, res) => {
  try {
    //Get user from database with same fullName if any
    const validateUserfullName = async (fullName) => {
      let checkUser = await User.findOne({ fullName });
      return checkUser ? false : true;
    };

    //Get user from database with same email if any
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

    // validate the email
    let emailNotRegistered = await validateEmail(req.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
      });
    }

    // Hash password using bcrypt
    const password = await bcrypt.hash(req.password, 12);
    // create a new user
    const newUser = new User({
      ...req,
      password,
      role,
    });

    await newUser.save();
    return res.status(201).json({
      message: "You are successfully registred. Please login.",
    });
  } catch (err) {
    // Implement logger function if any
    return res.status(500).json({
      message: `${err.message}`,
    });
  }
};

//LOGIN LOGIC

const userLogin = async (req, role, res) => {
  let { email, password } = req;

  // First Check if the user exist in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User email is not found. Invalid login credentials.",
      success: false,
    });
  }
  // We will check the if the user is logging in via the route for his departemnt
  if (user.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
      success: false,
    });
  }

  // That means the user is existing and trying to signin from the right portal
  // Now check if the password match
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // if the password match Sign a the token and issue it to the user
    let token = jwt.sign(
      {
        role: user.role,
        fullName: user.fullName,
        email: user.email,
      },
      process.env.APP_SECRET,
      { expiresIn: "3 days" }
    );

    let result = {
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };

    return res.status(200).json({
      ...result,
      message: "You are now logged in.",
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
    });
  }
};

module.exports = { userSignup, userLogin };
