import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "../controllers/product.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/",  getAllProducts);
router.get("/:id",  getSingleProduct);

// ✅ Create product with file upload
router.post("/", upload.single("image"), createProduct);

router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
