import Payment from '../models/payment.js';
import Order from '../models/order.js';

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const { orderId, user_id, amount, method } = req.body;

    // Validate required fields
    if (!orderId || !user_id || !amount || !method) {
      return res.status(400).json({
        message: 'orderId, user_id, amount, and method are required',
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Validate method
    const validMethods = ['cash', 'card', 'online'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({
        message: `Invalid payment method. Must be one of: ${validMethods.join(', ')}`,
      });
    }

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create payment
    const newPayment = new Payment({
      orderId,
      user_id,
      amount,
      method,
      status: 'paid',
    });

    const savedPayment = await newPayment.save();

    // Update order payment status
    order.paymentStatus = 'paid';
    await order.save();

    // Populate references and return
    const populatedPayment = await Payment.findById(savedPayment._id)
      .populate('orderId')
      .populate('user_id');

    res.status(201).json({
      message: 'Payment created successfully',
      payment: populatedPayment,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating payment',
      error: error.message,
    });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('orderId')
      .populate('user_id')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Payments retrieved successfully',
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving payments',
      error: error.message,
    });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ message: 'paymentId is required' });
    }

    const payment = await Payment.findById(paymentId)
      .populate('orderId')
      .populate('user_id');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({
      message: 'Payment retrieved successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving payment',
      error: error.message,
    });
  }
};

// Get payments by order ID
export const getPaymentsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const payments = await Payment.find({ orderId })
      .populate('orderId')
      .populate('user_id')
      .sort({ createdAt: -1 });

    if (payments.length === 0) {
      return res.status(404).json({
        message: 'No payments found for this order',
        payments: [],
      });
    }

    res.status(200).json({
      message: 'Order payments retrieved successfully',
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving order payments',
      error: error.message,
    });
  }
};

// Get payments by user ID
export const getPaymentsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const payments = await Payment.find({ user_id })
      .populate('orderId')
      .populate('user_id')
      .sort({ createdAt: -1 });

    if (payments.length === 0) {
      return res.status(404).json({
        message: 'No payments found for this user',
        payments: [],
      });
    }

    res.status(200).json({
      message: 'User payments retrieved successfully',
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user payments',
      error: error.message,
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: 'paymentId is required' });
    }

    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true, runValidators: true }
    )
      .populate('orderId')
      .populate('user_id');

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({
      message: 'Payment status updated successfully',
      payment: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating payment status',
      error: error.message,
    });
  }
};
