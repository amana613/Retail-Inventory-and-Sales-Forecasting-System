import Product from '../models/product.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Public
export const createProduct = async (req, res) => {
  try {
    const { name, supplier_id, category_id, price, reorder_level, description, image, discount, stock_qty, is_active } = req.body;

    // Validation
    if (!name || !supplier_id || !category_id || !price || reorder_level === undefined) {
      return res.status(400).json({ message: 'name, supplier_id, category_id, price, and reorder_level are required' });
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (reorder_level < 0) {
      return res.status(400).json({ message: 'Reorder level must be >= 0' });
    }

    // Validate discount if provided
    if (discount !== undefined && (discount < 0 || discount > 100)) {
      return res.status(400).json({ message: 'Discount must be between 0 and 100' });
    }

    // Prevent manual finalPrice input
    if (req.body.finalPrice !== undefined) {
      return res.status(400).json({ message: 'finalPrice is calculated automatically and cannot be set manually' });
    }

    const productData = {
      name,
      supplier_id,
      category_id,
      price,
      reorder_level,
      description,
      image,
      discount: discount || 0,
      stock_qty: stock_qty || 0,
      is_active: is_active !== undefined ? is_active : true
    };

    const product = new Product(productData);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all products (with supplier and category populated)
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('supplier_id', 'name')
      .populate('category_id', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Prevent manual finalPrice input
    if (req.body.finalPrice !== undefined) {
      return res.status(400).json({ message: 'finalPrice is calculated automatically and cannot be set manually' });
    }

    // Validate price if provided
    if (req.body.price !== undefined && req.body.price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    // Validate stock_qty if provided
    if (req.body.stock_qty !== undefined && req.body.stock_qty < 0) {
      return res.status(400).json({ message: 'Stock quantity must be >= 0' });
    }

    // Validate discount if provided
    if (req.body.discount !== undefined && (req.body.discount < 0 || req.body.discount > 100)) {
      return res.status(400).json({ message: 'Discount must be between 0 and 100' });
    }

    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true
    }).populate('supplier_id', 'name').populate('category_id', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get low stock products (stock_qty <= reorder_level)
// @route   GET /api/products/low-stock
// @access  Public
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ $expr: { $lte: ['$stock_qty', '$reorder_level'] } })
      .populate('supplier_id', 'name')
      .populate('category_id', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};