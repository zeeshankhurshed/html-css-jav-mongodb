import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createCategory, deleteCategory, getAllCategory, getSingleCategory, updateCategory } from '../controllers/category.js';
import { adminOnly } from '../middleware/adminOnly.js';


const router=express.Router();
router.get('/', authMiddleware, getAllCategory);
router.get('/:id', authMiddleware,getSingleCategory);

router.post('/', authMiddleware,adminOnly, createCategory);
router.put('/:id', authMiddleware,adminOnly, updateCategory);
router.delete("/:id", authMiddleware,adminOnly,deleteCategory)

export default router;