# Retail Inventory and Sales Forecasting System

University-level full-stack project that demonstrates:

- CRUD APIs with Express + MongoDB
- JWT authentication with simple roles (admin, customer, rider)
- React frontend using hooks + Context API
- Flask microservice for simple ML forecasting (Linear Regression)

## Tech Stack

- Frontend: React (Vite), Axios, React Router
- Backend: Node.js, Express.js, Mongoose, JWT, bcrypt
- Database: MongoDB
- ML Service: Python Flask, scikit-learn

## Project Structure

```text
backend/      -> Express REST API + MongoDB models
frontend/     -> React client
ml-service/   -> Flask forecasting microservice
```

## 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` using `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/retail_inventory_db
JWT_SECRET=your_jwt_secret_key
ML_SERVICE_URL=http://127.0.0.1:5001
```

Run backend:

```bash
npm run dev
```

## 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` using `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

## 3. ML Service Setup

```bash
cd ml-service
python -m venv .venv
# Activate venv (Windows)
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

ML endpoint:

- `POST /forecast`
- `GET /health`

## Main Features Implemented

- Authentication + role-based route protection
- Supplier CRUD
- Product CRUD + manual stock update + low stock alert flag
- Wishlist add/remove/list
- Reviews create/edit/delete/list by product
- Orders create/update/cancel/confirm
- Simulated payments
- Delivery assignment and rider status updates
- Customer order history and admin all-order history
- Admin forecast endpoint calling Flask service

## Important API Routes (Sample)

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products & Suppliers

- `GET /api/products`
- `POST /api/products` (admin)
- `PATCH /api/products/:id/stock` (admin)
- `GET /api/suppliers`

### Wishlist & Reviews

- `GET /api/wishlist`
- `POST /api/wishlist`
- `GET /api/reviews/product/:productId`
- `POST /api/reviews`

### Orders, Payments, Delivery

- `POST /api/orders`
- `PATCH /api/orders/:id/cancel`
- `PATCH /api/orders/:id/confirm` (admin)
- `POST /api/payments`
- `POST /api/deliveries/assign` (admin)
- `PATCH /api/deliveries/:id/status`

### Admin

- `GET /api/admin/orders/history`
- `GET /api/admin/forecast`

## Notes

- This is intentionally simplified for academic demonstration.
- Payment flow is simulated (no real gateway).
- Forecasting is basic linear regression over sales history.
