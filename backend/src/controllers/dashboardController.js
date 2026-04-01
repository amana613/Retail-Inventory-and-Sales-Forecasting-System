import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Supplier from '../models/Supplier.js';

// @desc    Get dashboard metrics (counts and totals)
// @route   GET /api/dashboard
// @access  Private/Admin
export const getDashboardMetrics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalUsers = await User.countDocuments({});
    const totalSuppliers = await Supplier.countDocuments({});

    const orders = await Order.find({});
    
    // Calculate total revenue from paid orders
    const totalRevenue = orders
      .filter((order) => order.isPaid)
      .reduce((acc, order) => acc + order.totalPrice, 0);

    // Calculate recent activity
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name');

    // Find products below their low_stock_threshold
    const lowStockProducts = await Product.find({ 
      $expr: { $lte: ["$stock_qty", "$low_stock_threshold"] } 
    }).sort({ stock_qty: 1 }).limit(10);

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalSuppliers,
      totalRevenue: totalRevenue.toFixed(2),
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard metrics', error: error.message });
  }
};