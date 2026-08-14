const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const validateObjectId = require('../utils/validateObjectId');

const VALID_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

// @desc  Get all orders
// @route GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single order
// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const idError = validateObjectId(req.params.id);
    if (idError) return next(idError);

    const order = await Order.findById(req.params.id);
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc  Create order (validates stock, creates snapshots, decrements stock)
// @route POST /api/orders
const createOrder = async (req, res, next) => {
  // Use a session for atomicity where supported
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customer, items, paymentMethod, shippingAddress } = req.body;

    // --- Validate required fields ---
    if (!customer || !customer.name || !customer.email || !customer.phone) {
      const error = new Error('Customer name, email, and phone are required');
      error.statusCode = 400;
      return next(error);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      const error = new Error('Please provide a valid email address');
      error.statusCode = 400;
      return next(error);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      const error = new Error('Order must contain at least one item');
      error.statusCode = 400;
      return next(error);
    }

    if (!paymentMethod) {
      const error = new Error('Payment method is required');
      error.statusCode = 400;
      return next(error);
    }

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      const error = new Error('Complete shipping address is required (street, city, postal code, country)');
      error.statusCode = 400;
      return next(error);
    }

    // --- Validate product IDs ---
    for (const item of items) {
      const idError = validateObjectId(item.product);
      if (idError) {
        await session.abortTransaction();
        session.endSession();
        return next(new Error(`Invalid product ID: ${item.product}`));
      }
      if (!item.quantity || Number(item.quantity) < 1 || !Number.isInteger(Number(item.quantity))) {
        await session.abortTransaction();
        session.endSession();
        const error = new Error('Each item must have a valid quantity (positive integer)');
        error.statusCode = 400;
        return next(error);
      }
    }

    // --- Fetch products and validate stock ---
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        const error = new Error(`Product not found: ${item.product}`);
        error.statusCode = 404;
        return next(error);
      }

      const requestedQty = Number(item.quantity);
      if (product.quantity < requestedQty) {
        await session.abortTransaction();
        session.endSession();
        const error = new Error(
          `Insufficient stock for "${product.name}". Available: ${product.quantity}, Requested: ${requestedQty}`
        );
        error.statusCode = 400;
        return next(error);
      }

      const subtotal = parseFloat((product.price * requestedQty).toFixed(2));
      totalAmount += subtotal;

      // Create product snapshot
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: requestedQty,
        subtotal,
      });

      // Decrement stock
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { quantity: -requestedQty } },
        { session, new: true }
      );
    }

    totalAmount = parseFloat(totalAmount.toFixed(2));

    // --- Create the order ---
    const [order] = await Order.create(
      [
        {
          customer,
          items: orderItems,
          totalAmount,
          paymentMethod,
          shippingAddress,
          status: 'Pending',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc  Update order status
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const idError = validateObjectId(req.params.id);
    if (idError) return next(idError);

    const { status } = req.body;

    if (!status) {
      const error = new Error('Status is required');
      error.statusCode = 400;
      return next(error);
    }

    if (!VALID_STATUSES.includes(status)) {
      const error = new Error(
        `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      );
      error.statusCode = 400;
      return next(error);
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete order
// @route DELETE /api/orders/:id
const deleteOrder = async (req, res, next) => {
  try {
    const idError = validateObjectId(req.params.id);
    if (idError) return next(idError);

    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
