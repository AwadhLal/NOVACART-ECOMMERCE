const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc  Get dashboard statistics
// @route GET /api/dashboard/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const LOW_STOCK_THRESHOLD = 10;

    const [totalProducts, totalOrders, revenueResult, lowStockProducts, recentOrders] =
      await Promise.all([
        // Total product count
        Product.countDocuments(),

        // Total order count
        Order.countDocuments(),

        // Total revenue (sum of all order totalAmounts)
        Order.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: '$totalAmount' },
            },
          },
        ]),

        // Low stock products (quantity < threshold)
        Product.find({ quantity: { $lt: LOW_STOCK_THRESHOLD } })
          .select('name quantity category brand image')
          .sort({ quantity: 1 })
          .limit(20),

        // 5 most recent orders
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('orderNumber customer totalAmount status createdAt'),
      ]);

    const totalRevenue =
      revenueResult.length > 0
        ? parseFloat(revenueResult[0].total.toFixed(2))
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
