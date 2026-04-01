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

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
export const updateSupplier = async (req, res) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
      supplier.name = name || supplier.name;
      supplier.contactPerson = contactPerson || supplier.contactPerson;
      supplier.email = email || supplier.email;
      supplier.phone = phone || supplier.phone;
      supplier.address = address || supplier.address;

      const updatedSupplier = await supplier.save();
      res.json(updatedSupplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get supplier by ID
// @route   GET /api/suppliers/:id
// @access  Private/Admin
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
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
