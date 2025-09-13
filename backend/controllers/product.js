import Product from "../models/product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { asyncHandler } from "../middleware/asyncHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;

    if (!name || !category || !price || !quantity) {
      return res.status(400).json({ message: "Please fill in required fields" });
    }

    const existingProduct = await Product.findOne({ name, category });
    if (existingProduct) {
      return res.status(409).json({
        message: "Product with this name and category already exists",
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      category,   // ✅ single category string
      image,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// @desc Get single product
// @route GET /api/products/:id
export const getSingleProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findById(id);

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      success: true,
      data: products,   // make sure this exists
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @desc Delete product
// @route DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc Update product
// @route PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imagePath = existingProduct.image;
    if (req.file) {
      if (existingProduct.image) {
        const oldImagePath = path.join(__dirname, "..", existingProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/${req.file.filename}`;
    }

   const updates = {
  name: req.body.name || existingProduct.name,
  description: req.body.description || existingProduct.description,
  price: req.body.price || existingProduct.price,
  quantity: req.body.quantity || existingProduct.quantity,
  category: req.body.category || existingProduct.category, // ✅ FIXED
  image: imagePath,
};


    const result = await Product.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct: result,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    // Clean up uploaded file if error occurred
    if (req.file) {
      const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});
