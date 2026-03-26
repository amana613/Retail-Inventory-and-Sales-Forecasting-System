# Retail Inventory and Sales Forecasting System - Backend

This is the backend for the Retail Inventory and Sales Forecasting System, focusing on Supplier and Product Management.

## Features

- Supplier CRUD operations
- Category management
- Product CRUD with supplier and category references
- Stock management (quantity, reorder level)
- Low stock detection
- Restocking process via purchase records

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with:
   ```
   MONGO_URI=mongodb://localhost:27017/retail_inventory
   PORT=5000
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Suppliers
- GET /api/suppliers - Get all suppliers
- POST /api/suppliers - Create supplier
- GET /api/suppliers/:id - Get supplier by ID
- PUT /api/suppliers/:id - Update supplier
- DELETE /api/suppliers/:id - Delete supplier

### Categories
- GET /api/categories - Get all categories
- POST /api/categories - Create category
- GET /api/categories/:id - Get category by ID
- PUT /api/categories/:id - Update category
- DELETE /api/categories/:id - Delete category

### Products
- GET /api/products - Get all products
- POST /api/products - Create product
- GET /api/products/:id - Get product by ID
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product
- GET /api/products/low-stock - Get low stock products
- PUT /api/products/:id/stock - Update product stock

### Purchases
- GET /api/purchases - Get all purchases
- POST /api/purchases - Create purchase (restocking)
- GET /api/purchases/:id - Get purchase by ID
- PUT /api/purchases/:id - Update purchase
- DELETE /api/purchases/:id - Delete purchase

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose