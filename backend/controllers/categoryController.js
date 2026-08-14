const Category = require('../models/Category');
const validateObjectId = require('../utils/validateObjectId');

// @desc  Get all categories
// @route GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single category
// @route GET /api/categories/:id
const getCategoryById = async (req, res, next) => {
  try {
    const idError = validateObjectId(req.params.id);
    if (idError) return next(idError);

    const category = await Category.findById(req.params.id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc  Create category
// @route POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !name.trim()) {
      const error = new Error('Category name is required');
      error.statusCode = 400;
      return next(error);
    }

    const category = await Category.create({ name: name.trim(), description, image });
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update category
// @route PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const idError = validateObjectId(req.params.id);
    if (idError) return next(idError);

    const { name, description, image } = req.body;

    // Check duplicate name (exclude current doc)
    if (name) {
      const existing = await Category.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });
      if (existing) {
        const error = new Error(`Category name "${name.trim()}" already exists`);
        error.statusCode = 409;
        return next(error);
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name?.trim(), description, image },
      { new: true, runValidators: true }
    );

    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete category
// @route DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const idError = validateObjectId(req.params.id);
    if (idError) return next(idError);

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
