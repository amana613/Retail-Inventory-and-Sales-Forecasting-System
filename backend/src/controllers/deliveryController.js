import Delivery from "../models/Delivery.js";
import Order from "../models/Order.js";

export const assignRider = async (req, res) => {
  const { order_id, rider_id } = req.body;
  if (!order_id || !rider_id) {
    return res.status(400).json({ message: "order_id and rider_id are required" });
  }

  const order = await Order.findById(order_id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const delivery = await Delivery.findOneAndUpdate(
    { order_id },
    { rider_id, status: "processing" },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate("rider_id", "name email");

  res.json(delivery);
};

export const getMyDeliveries = async (req, res) => {
  const deliveries = await Delivery.find({ rider_id: req.user._id })
    .populate("order_id")
    .sort({ createdAt: -1 });
  res.json(deliveries);
};

export const updateDeliveryStatus = async (req, res) => {
  const { status } = req.body;
  if (!status || !["processing", "dispatched", "delivered"].includes(status)) {
    return res.status(400).json({ message: "Valid status is required" });
  }

  const delivery = await Delivery.findById(req.params.id);
  if (!delivery) {
    return res.status(404).json({ message: "Delivery not found" });
  }

  const isOwnerRider = delivery.rider_id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwnerRider && !isAdmin) {
    return res.status(403).json({ message: "Not authorized" });
  }

  delivery.status = status;
  await delivery.save();

  res.json(delivery);
};

export const getAllDeliveries = async (_req, res) => {
  const deliveries = await Delivery.find()
    .populate("order_id")
    .populate("rider_id", "name email")
    .sort({ createdAt: -1 });
  res.json(deliveries);
};
