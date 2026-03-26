import Order from "../models/Order.js";
import Product from "../models/Product.js";
import SalesHistory from "../models/SalesHistory.js";

const calculateOrderTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const createOrder = async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order items are required" });
  }

  const total_amount = calculateOrderTotal(items);
  const order = await Order.create({
    user_id: req.user._id,
    items,
    total_amount,
    status: "pending"
  });

  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user_id: req.user._id })
    .populate("items.product_id", "name price")
    .sort({ createdAt: -1 });
  res.json(orders);
};

export const getAllOrders = async (_req, res) => {
  const orders = await Order.find()
    .populate("user_id", "name email role")
    .populate("items.product_id", "name price")
    .sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const isOwner = order.user_id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not authorized to update this order" });
  }

  if (req.body.items) {
    order.items = req.body.items;
    order.total_amount = calculateOrderTotal(req.body.items);
  }

  if (req.body.status && isAdmin) {
    order.status = req.body.status;
  }

  await order.save();
  res.json(order);
};

export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const isOwner = order.user_id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not authorized to cancel this order" });
  }

  order.status = "cancelled";
  await order.save();

  res.json(order);
};

export const confirmOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === "confirmed") {
    return res.status(400).json({ message: "Order already confirmed" });
  }

  for (const item of order.items) {
    const product = await Product.findById(item.product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found in order items" });
    }

    if (product.stock_qty < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for ${product.name}`
      });
    }
  }

  for (const item of order.items) {
    const product = await Product.findById(item.product_id);
    product.stock_qty -= item.quantity;
    await product.save();

    await SalesHistory.create({
      date: new Date(),
      product_id: product._id,
      quantity_sold: item.quantity,
      revenue: item.price * item.quantity
    });
  }

  order.status = "confirmed";
  await order.save();

  res.json({ message: "Order confirmed and stock updated", order });
};
