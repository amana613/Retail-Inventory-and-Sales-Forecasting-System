import Purchase from '../models/purchase.js';
import Product from '../models/product.js';

// @desc    Create a purchase (initial record, status Pending)
// @route   POST /api/purchases
// @access  Public
export const createPurchase = async (req, res) => {
  try {
    const { product_id, supplier_id, qty } = req.body;

    // Validation
    if (!product_id || !supplier_id || qty === undefined) {
      return res.status(400).json({ message: 'product_id, supplier_id, and qty are required' });
    }

    if (qty <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const purchase = new Purchase({
      product_id,
      supplier_id,
      qty,
      status: 'Pending'
    });

    const createdPurchase = await purchase.save();
    res.status(201).json(createdPurchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Confirm purchase (mark as Received and increase product stock)
// @route   PUT /api/purchases/:id/confirm
// @access  Public
export const confirmPurchase = async (req, res) => {
  try {
    const purchaseId = req.params.id;

    // Validate ObjectId
    if (!purchaseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid purchase ID' });
    }

    const purchase = await Purchase.findById(purchaseId);

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    // Check if already confirmed
    if (purchase.status === 'Received') {
      return res.status(400).json({ message: 'Purchase already confirmed' });
    }

    // Update purchase status to Received
    purchase.status = 'Received';
    await purchase.save();

    // Update product stock
    const product = await Product.findByIdAndUpdate(
      purchase.product_id,
      { $inc: { stock_qty: purchase.qty } },
      { new: true }
    ).populate('supplier_id', 'name').populate('category_id', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Purchase confirmed and stock updated',
      purchase: await purchase.populate('product_id').populate('supplier_id'),
      product
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};