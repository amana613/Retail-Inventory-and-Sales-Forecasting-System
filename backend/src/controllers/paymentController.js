import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

export const createPayment = async (req, res) => {
  const { order_id, method } = req.body;

  if (!order_id) {
    return res.status(400).json({ message: "order_id is required" });
  }

  const order = await Order.findById(order_id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const payment = await Payment.create({
    order_id,
    amount: order.total_amount,
    method: method || "simulated",
    status: "success"
  });

  res.status(201).json({
    message: "Payment simulated successfully",
    payment
  });
};

export const getPayments = async (_req, res) => {
  const payments = await Payment.find().populate("order_id");
  res.json(payments);
};
