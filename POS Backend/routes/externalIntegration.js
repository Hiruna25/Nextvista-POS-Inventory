const express = require('express');
const Product = require('../models/Product');
const POSTransaction = require('../models/POSTransaction');
const InventoryHistory = require('../models/InventoryHistory');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');
const { paginate, paginationResponse } = require('../middleware/pagination');
const { catchAsyncErrors, AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

const router = express.Router();

// Get products for external billing integration
router.get('/products', apiKeyAuth, paginate, catchAsyncErrors(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ]
    };
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .populate('category', 'name')
    .populate('supplier', 'name')
    .populate('branch', 'name')
    .lean();

  logger.info(`External integration retrieved ${products.length} products`);
  res.json(paginationResponse(products, total, req.pagination.page, req.pagination.limit));
}));

// Create a POS transaction from external billing system
router.post('/pos-transactions', apiKeyAuth, catchAsyncErrors(async (req, res) => {
  const { product, quantity, totalAmount, branch } = req.body;

  if (!product || typeof quantity !== 'number' || quantity <= 0 || typeof totalAmount !== 'number') {
    throw new AppError('product, quantity, and totalAmount are required and must be valid', 400);
  }

  const transaction = new POSTransaction({ product, quantity, totalAmount, branch });
  await transaction.save();

  const prod = await Product.findById(product);
  if (prod) {
    const previousStock = prod.stockQuantity;
    prod.stockQuantity -= quantity;
    await prod.save();

    const history = new InventoryHistory({
      product,
      action: 'sale',
      quantity,
      previousStock,
      newStock: prod.stockQuantity,
      notes: 'External billing transaction'
    });
    await history.save();
  }

  logger.info(`External billing POS transaction created: ${transaction._id}`);
  res.status(201).json({ success: true, message: 'Transaction created', data: transaction });
}));

module.exports = router;
