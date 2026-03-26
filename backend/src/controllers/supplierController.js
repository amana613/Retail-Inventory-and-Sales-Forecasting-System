import Supplier from "../models/Supplier.js";

export const createSupplier = async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json(supplier);
};

export const getSuppliers = async (_req, res) => {
  const suppliers = await Supplier.find().sort({ createdAt: -1 });
  res.json(suppliers);
};

export const getSupplierById = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    return res.status(404).json({ message: "Supplier not found" });
  }
  res.json(supplier);
};

export const updateSupplier = async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!supplier) {
    return res.status(404).json({ message: "Supplier not found" });
  }

  res.json(supplier);
};

export const deleteSupplier = async (req, res) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);
  if (!supplier) {
    return res.status(404).json({ message: "Supplier not found" });
  }
  res.json({ message: "Supplier deleted" });
};
