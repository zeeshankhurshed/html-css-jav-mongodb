import express from 'express';
import { 
  createUser, 
  deleteUser, 
  getAllUser, 
  getSpecificUser, 
  loginUser, 
  logoutUser, 
  updateUser 
} from '../controllers/user.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router();

// User registration
router.post("/register", createUser);

// User login
router.post("/login", loginUser);

// User logout
router.post("/logout", logoutUser);

// Get specific user (admin only)
router.get("/:id", authMiddleware, adminOnly, getSpecificUser);

// Get all users (admin only)
router.get("/", authMiddleware, adminOnly, getAllUser);

// Delete user (admin only)
router.delete("/:id", authMiddleware, adminOnly, deleteUser);

// Update user (admin only)
router.put("/:id", authMiddleware, adminOnly, updateUser);

export default router;
