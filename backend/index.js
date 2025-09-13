import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/user.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
const port = 5555;

// --- Middleware ---
// Enable CORS
app.use(cors({
  origin: '*', // allow all origins, adjust in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// --- Routes ---
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);


app.use('/uploads', express.static('uploads'));

// --- Server ---
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
