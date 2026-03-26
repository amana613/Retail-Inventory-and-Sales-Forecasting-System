import { getForecast } from "../services/forecastService.js";
import Order from "../models/Order.js";

export const forecastDemand = async (_req, res) => {
  try {
    const result = await getForecast();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch forecast from ML service",
      error: error.message
    });
  }
};

export const getAdminOrderHistory = async (_req, res) => {
  const orders = await Order.find()
    .populate("user_id", "name email role")
    .populate("items.product_id", "name")
    .sort({ createdAt: -1 });

  res.json(orders);
};
