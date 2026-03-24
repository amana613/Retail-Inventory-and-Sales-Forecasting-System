import Supplier from '../models/supplier.js';

// @desc    Create a supplier
// @route   POST /api/suppliers
// @access  Public
export const createSupplier = async (req, res) => {
  try {
    const { name, contact, email, address } = req.body;

    // Validation
    if (!name || !contact || !address) {
      return res.status(400).json({ message: 'name, contact, and address are required' });
    }

    const supplier = new Supplier(req.body);
    const createdSupplier = await supplier.save();
    res.status(201).json(createdSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Public
export const updateSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;

    // Validate ObjectId
    if (!supplierId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }

    const supplier = await Supplier.findByIdAndUpdate(supplierId, req.body, {
      new: true,
      runValidators: true
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Public
export const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;

    // Validate ObjectId
    if (!supplierId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }

    const supplier = await Supplier.findByIdAndDelete(supplierId);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};