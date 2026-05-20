const express = require('express');
const POSTransaction = require('../models/POSTransaction');
const Product = require('../models/Product');
const InventoryHistory = require('../models/InventoryHistory');
const { auth, requirePermission } = require('../middleware/auth');
const { catchAsyncErrors, AppError } = require('../middleware/errorHandler');
const { paginationResponse } = require('../middleware/pagination');
const logger = require('../config/logger');

const router = express.Router();

// Get all POS transactions
router.get('/', auth, catchAsyncErrors(async (req, res, next) => {
  const total = await POSTransaction.countDocuments();
  const transactions = await POSTransaction.find()
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .populate('product', 'name')
    .populate('branch', 'name')
    .sort({ createdAt: -1 })
    .lean();
  logger.info(`Retrieved ${transactions.length} POS transactions`);
  res.json(paginationResponse(transactions, total, req.pagination.page, req.pagination.limit));
}));

// Create POS transaction
router.post('/', auth, requirePermission(['manage_inventory']), catchAsyncErrors(async (req, res, next) => {
  const { product, quantity, totalAmount, branch } = req.body;
  const transaction = new POSTransaction({ product, quantity, totalAmount, branch });
  await transaction.save();

  // Update product stock
  const prod = await Product.findById(product);
  if (prod) {
    const previousStock = prod.stockQuantity;
    prod.stockQuantity -= quantity;
    await prod.save();

    // Log inventory history
    const history = new InventoryHistory({
      product,
      action: 'sale',
      quantity,
      previousStock,
      newStock: prod.stockQuantity,
      notes: 'POS transaction'
    });
    await history.save();
  }

  logger.info(`POS transaction created: ${transaction._id}`);
  res.status(201).json({ success: true, message: 'Transaction created', data: transaction });
}));

module.exports = router;