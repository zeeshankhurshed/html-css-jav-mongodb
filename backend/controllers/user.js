import { asyncHandler } from "../middleware/asyncHandler.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { genToken } from "../utils/genToken.js";

// @desc Register new user
// @route POST /api/users
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(401).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = genToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    message: "Registered successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// @desc Login user
// @route POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password" });
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = genToken(existingUser._id);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Login successful",
    userInfo: {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    },
  });
});

// @desc Logout user
// @route POST /api/users/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax", // keep consistent
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc Get all users
// @route GET /api/users
export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc Get user by ID
// @route GET /api/users/:id
export const getSpecificUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const specificUser = await User.findById(id);

  if (!specificUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    _id: specificUser._id,
    name: specificUser.name,
    email: specificUser.email,
  });
});

// @desc Update logged-in user
// @route PUT /api/users/profile
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
  });
});

// @desc Delete user
// @route DELETE /api/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();
  res.status(200).json({ message: "User removed successfully" });
});
