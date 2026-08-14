const Product = require('../models/Product');
const validateObjectId = require('../utils/validateObjectId');

// @desc  Get all products (supports search and category filter)
// @route GET /api/products?search=&category=
const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const query = {};

    // Text search on name and description
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter (case-insensitive)
    if (category && category.trim()) {
      query.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single product
// @route GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const idError = validateObjectId(req.params.id);
    if (idError) return next(idError);

    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc  Create product
// @route POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, rating, category, image, brand, sku, discount } =
      req.body;

    // Required field validation
    if (!name || !name.trim()) {
      const error = new Error('Product name is required');
      error.statusCode = 400;
      return next(error);
    }
    if (!description || !description.trim()) {
      const error = new Error('Product description is required');
      error.statusCode = 400;
      return next(error);
    }
    if (price === undefined || price === null) {
      const error = new Error('Product price is required');
      error.statusCode = 400;
      return next(error);
    }
    if (price < 0) {
      const error = new Error('Price cannot be negative');
      error.statusCode = 400;
      return next(error);
    }
    if (quantity === undefined || quantity === null) {
      const error = new Error('Product quantity is required');
      error.statusCode = 400;
      return next(error);
    }
    if (quantity < 0 || !Number.isInteger(Number(quantity))) {
      const error = new Error('Quantity must be a non-negative integer');
      error.statusCode = 400;
      return next(error);
    }
    if (!category || !category.trim()) {
      const error = new Error('Product category is required');
      error.statusCode = 400;
      return next(error);
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      quantity: Number(quantity),
      rating: rating || 0,
      category: category.trim(),
      image,
      brand,
      sku,
      discount: discount || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update product
// @route PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const idError = validateObjectId(req.params.id);
    if (idError) return next(idError);

    const updates = req.body;

    // Validate price if provided
    if (updates.price !== undefined && updates.price < 0) {
      const error = new Error('Price cannot be negative');
      error.statusCode = 400;
      return next(error);
    }

    // Validate quantity if provided
    if (updates.quantity !== undefined) {
      if (updates.quantity < 0 || !Number.isInteger(Number(updates.quantity))) {
        const error = new Error('Quantity must be a non-negative integer');
        error.statusCode = 400;
        return next(error);
      }
      updates.quantity = Number(updates.quantity);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete product
// @route DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const idError = validateObjectId(req.params.id);
    if (idError) return next(idError);

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
