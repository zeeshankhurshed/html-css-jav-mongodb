import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const authMiddleware = async (req, res, next) => {
 const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");


  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
// console.log("Decoded Token:", decoded); // ADD THIS LINE

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("User Error:", error);
    res.status(401).json({ message: "Not authorized, token verification failed" });
  }
};
