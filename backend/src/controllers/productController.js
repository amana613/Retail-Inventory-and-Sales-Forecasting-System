import Product from "../models/Product.js";

const LOW_STOCK_THRESHOLD = 10;

export const createProduct = async (req, res) => {
  const { name, category, price, stock_qty, supplier_id } = req.body;

  if (!name || !category || price == null || stock_qty == null || !supplier_id) {
    return res.status(400).json({ message: "All product fields are required" });
  }

  const product = await Product.create({ name, category, price, stock_qty, supplier_id });
  res.status(201).json(product);
};

export const getProducts = async (_req, res) => {
  const products = await Product.find().populate("supplier_id", "name contact_email");
  const enriched = products.map((product) => ({
    ...product.toObject(),
    low_stock_alert: product.stock_qty <= LOW_STOCK_THRESHOLD
  }));
  res.json(enriched);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("supplier_id", "name contact_email");
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({
    ...product.toObject(),
    low_stock_alert: product.stock_qty <= LOW_STOCK_THRESHOLD
  });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};

export const updateProductStock = async (req, res) => {
  const { stock_qty } = req.body;
  if (stock_qty == null || stock_qty < 0) {
    return res.status(400).json({ message: "Valid stock quantity is required" });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock_qty },
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({
    ...product.toObject(),
    low_stock_alert: product.stock_qty <= LOW_STOCK_THRESHOLD
  });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json({ message: "Product deleted" });
};
