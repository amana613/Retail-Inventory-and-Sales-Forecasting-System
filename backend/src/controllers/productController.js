import Product from "../models/Product.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("supplier_id", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "supplier_id",
      "name",
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      countInStock,
      supplier,
      image,
      low_stock_threshold,
    } = req.body;

    const product = new Product({
      name,
      brand,
      category,
      description: description || "No description provided",
      price: Number(price),
      stock_qty:
        countInStock !== undefined && countInStock !== ""
          ? Number(countInStock)
          : 0,
      low_stock_threshold:
        low_stock_threshold !== undefined && low_stock_threshold !== ""
          ? Number(low_stock_threshold)
          : 10,
      supplier_id: supplier || null,
      image_url: image || "",
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create Product Error:", error.message);
    res
      .status(400)
      .json({ message: "Invalid product data", error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      countInStock,
      supplier,
      image,
      low_stock_threshold,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined && name !== "" ? name : product.name;
      product.brand = brand !== undefined ? brand : product.brand;
      product.category =
        category !== undefined && category !== "" ? category : product.category;
      product.description =
        description !== undefined && description !== ""
          ? description
          : product.description || "No description provided";
      product.price =
        price !== undefined && price !== "" ? Number(price) : product.price;
      product.stock_qty =
        countInStock !== undefined && countInStock !== ""
          ? Number(countInStock)
          : product.stock_qty;
      product.low_stock_threshold =
        low_stock_threshold !== undefined && low_stock_threshold !== ""
          ? Number(low_stock_threshold)
          : product.low_stock_threshold;
      product.supplier_id =
        supplier !== undefined && supplier !== ""
          ? supplier
          : product.supplier_id;
      product.image_url = image !== undefined ? image : product.image_url;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid product data", error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
