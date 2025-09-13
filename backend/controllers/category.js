import { asyncHandler } from "../middleware/asyncHandler.js";
import Category from "../models/category.js";

export const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description,brand } = req.body;

    if (!name || !description || !brand) {
      return res.status(400).json({ message: "Please fill in required fields." });
    }

    // Check for duplicate name
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({ message: "Category name already exists." });
    }

    // Create and save new category
    const newCategory = new Category({ name, description,brand });
    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
})

export const getSingleCategory =asyncHandler (async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Category.findById(id);

    if (!result) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(result); // 200 is more appropriate for a GET success
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
)

export const getAllCategory=asyncHandler(async(req,res)=>{
    try {
        const result=await Category.find();

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({message:"Internal servber error"})
    }
})

export const deleteCategory=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        const result=await Category.findByIdAndDelete(id);
        if(!result){
            return res.status(404).json({message:"Category not found"});
        }
        res.status(200).json({message:"Category deleted successfully"})
    } catch (error) {
         console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
    }
})

export const updateCategory=asyncHandler(async(req,res)=>{
try {
    if(!req.body){
        return res.status(400).json({message:"No data provided"});
    }
    const {id}=req.params;
    const {name}=req.body;

    const result=await Category.findByIdAndUpdate(id,{name}, {new:true});

    if(!result){
        return res.status(404).json({message:"Category not found"});
    }

    res.status(200).json({message:"Category updated successfully", updatedCategory:result})
} catch (error) {
      console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
}
})
