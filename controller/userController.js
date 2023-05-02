const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");

// @DESC Register New User
// @route POST /api/users
// @access Public

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please Add All Fields");
  }

  // check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  // HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // CREATE USER IF NO ERROR IS THROWN
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

// @DESC Authentication
// @routes POST /api/users/login
// @ACCESS Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // check the provided email in database
  const user = await User.findOne({ email });
  const compared = await bcrypt.compare(password, user.password)

  if (user && compared) {
    res.json({
      _id: user.id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});


// DESC UPDATE user data
// @Route PUT /api/users/me/:id
// @ACCESS private
const updateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const updates = {};
  if (email) {
    updates.email = email;
  }
  // HASH NEW PASSWORD
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updates.password = hashedPassword;
  }

  // UPDATE USER 
  const result = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true }
  );

  if (!result) {
    res.status(400);
    throw new Error("Failed to update user");
  }

  res.json({
    _id: result._id,
    email: result.email,
    token: generateToken(result._id)
  });
});

// DESC Get user data
// @rouute GET /api/users/me
// @access Private
const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { registerUser, loginUser, getUser, updateUser };
