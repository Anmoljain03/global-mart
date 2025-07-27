import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// ⬇️ Needed if you're using ES modules (import/export syntax)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// ✅ Serve the uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.send("API Working");
});

// Start server
app.listen(port, () => console.log('Server started on PORT : ' + port));
