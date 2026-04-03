import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Update product stock quantities
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock_qty = Math.max(0, product.stock_qty - item.qty);
          await product.save();
        }
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("rider", "name email phone");

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("user", "id name")
      .populate("rider", "id name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "rider") {
      query.rider = req.user._id;
    }
    const orders = await Order.find(query)
      .populate("user", "id name")
      .populate("rider", "id name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/deliver
// @access  Private/Rider
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Security check: Only riders can mark as delivered
      if (req.user.role !== "rider") {
        return res
          .status(403)
          .json({
            message: "Only delivery riders can mark orders as delivered.",
          });
      }

      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = "delivered";

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Processing, Shipped, etc)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin or Rider
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const { status } = req.body;

    if (order) {
      // Security check: Admins cannot update to in-transit or delivered via this route
      if (
        req.user.role !== "rider" &&
        ["in-transit", "delivered"].includes(status)
      ) {
        return res
          .status(403)
          .json({
            message:
              "Admins can only update statuses up to dispatched. The rest are managed by the rider.",
          });
      }

      // Security check: Riders cannot revert or update to pre-dispatch statuses
      if (
        req.user.role === "rider" &&
        ["pending", "processing"].includes(status)
      ) {
        return res
          .status(403)
          .json({
            message: "Riders can only manage statuses from dispatched onwards.",
          });
      }

      order.status = status || order.status;

      // If status is delivered, set the order to delivered state
      if (order.status === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign rider to order
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
export const assignRider = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const { riderId } = req.body;

    if (order) {
      order.rider = riderId;
      order.status = "dispatched";
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      // Only mock paypal response details
      order.paymentResult = {
        id: req.body.id || "cash_on_delivery",
        status: req.body.status || "COMPLETED",
        update_time: req.body.update_time || Date.now(),
        email_address: req.body.email_address || "admin@store.com",
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload Receipt
// @route   POST /api/orders/:id/receipt
// @access  Private
export const uploadReceipt = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (req.file) {
        // Using local storage for now, store file path in database
        order.receiptImage = `/uploads/receipts/${req.file.filename}`;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(400).json({ message: "No image uploaded" });
      }
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
