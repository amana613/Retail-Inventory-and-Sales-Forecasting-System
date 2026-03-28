import Order from '../models/order.js';
import Payment from '../models/payment.js';
import Product from '../models/product.js';
import User from '../models/userModel.js';
import nodemailer from 'nodemailer';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { user_id, items } = req.body;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items array cannot be empty' });
    }

    // Check product stock and calculate total amount
    let totalAmount = 0;
    const updatedItems = [];

    for (const item of items) {
      // Find product
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }

      // Check stock availability
      if (product.stock_qty < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock_qty}, Requested: ${item.quantity}`,
        });
      }

      // Calculate total amount
      const itemPrice = item.price || product.price;
      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;

      updatedItems.push({
        productId: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
      });

      // Reduce product stock
      product.stock_qty -= item.quantity;
      await product.save();
    }

    // Create order
    const newOrder = new Order({
      user_id,
      items: updatedItems,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
    });

    const savedOrder = await newOrder.save();

    // Create payment record
    const payment = new Payment({
      orderId: savedOrder._id,
      user_id,
      amount: totalAmount,
      method: 'card',
      status: 'pending',
    });

    await payment.save();

    // Populate references and return
    const populatedOrder = await Order.findById(savedOrder._id).populate(
      'user_id'
    );

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating order',
      error: error.message,
    });
  }
};

// Get all orders sorted by newest first
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user_id')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Orders retrieved successfully',
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving orders',
      error: error.message,
    });
  }
};

// Get orders by user_id
export const getUserOrders = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const orders = await Order.find({ user_id })
      .populate('user_id')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found for this user',
        orders: [],
      });
    }

    res.status(200).json({
      message: 'User orders retrieved successfully',
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user orders',
      error: error.message,
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    // Validate status enum
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    ).populate('user_id');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating order status',
      error: error.message,
    });
  }
};

// Get incoming orders (paid and pending)
export const getIncomingOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      paymentStatus: 'paid',
      status: 'pending',
    })
      .populate('user_id')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Incoming orders retrieved successfully',
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving incoming orders',
      error: error.message,
    });
  }
};

// Confirm order
export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status to "confirmed"
    order.status = 'confirmed';
    // Set confirmedAt to current timestamp
    order.confirmedAt = new Date();
    await order.save();

    const updatedOrder = await Order.findById(orderId).populate('user_id');

    res.status(200).json({
      message: 'Order confirmed successfully',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error confirming order',
      error: error.message,
    });
  }
};

// Assign rider to order and send email
export const assignRider = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { staffrider_id } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    if (!staffrider_id) {
      return res.status(400).json({ message: 'staffrider_id is required' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update assignedRiderId, status, and deliveryStatus
    order.assignedRiderId = staffrider_id;
    order.status = 'assigned';
    order.deliveryStatus = 'On the way';
    await order.save();

    // Fetch the customer email from User table using order.user_id
    const customer = await User.findById(order.user_id);

    if (customer && customer.email) {
      try {
        // Setup nodemailer transporter using environment variables
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Send email to customer
        const customerName = customer.firstName || customer.name || 'Valued Customer';
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: customer.email,
          subject: 'Your order is on the way',
          html: `
            <h2>Hello ${customerName},</h2>
            <p>Your order <strong>#${order._id}</strong> has been assigned a rider and is on the way.</p>
            <p>We appreciate your purchase!</p>
            <br/>
            <p>Best regards,<br/>The Retail Team</p>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    const updatedOrder = await Order.findById(orderId).populate('user_id');

    res.status(200).json({
      message: 'Rider assigned successfully',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error assigning rider',
      error: error.message,
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Allow cancel only if status === "pending"
    if (order.status === 'confirmed' || order.status === 'assigned') {
      return res.status(400).json({
        message: 'Order already processed',
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Restore product stock quantities
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock_qty += item.quantity;
        await product.save();
      }
    }

    // Update order status to cancelled
    order.status = 'cancelled';
    await order.save();

    const updatedOrder = await Order.findById(orderId).populate('user_id');

    res.status(200).json({
      message: 'Order cancelled successfully',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error cancelling order',
      error: error.message,
    });
  }
};
