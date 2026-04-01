import Supplier from '../models/Supplier.js';

// @desc    Fetch all suppliers
// @route   GET /api/suppliers
// @access  Private/Admin
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/suppliers
// @access  Private/Admin
export const createSupplier = async (req, res) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;

    const supplierExists = await Supplier.findOne({ email });

    if (supplierExists) {
      res.status(400);
      throw new Error('Supplier already exists');
    }

    const supplier = await Supplier.create({
      name,
      contactPerson,
      email,
      phone,
      address,
    });

    if (supplier) {
      res.status(201).json(supplier);
    } else {
      res.status(400);
      throw new Error('Invalid supplier data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (supplier) {
      await supplier.deleteOne();
      res.json({ message: 'Supplier removed' });
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
