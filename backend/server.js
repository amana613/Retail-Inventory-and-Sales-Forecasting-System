import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import supplierRoutes from './src/routes/supplierRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import purchaseRoutes from './src/routes/purchaseRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api/suppliers', supplierRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});