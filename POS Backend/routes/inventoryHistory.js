const express = require('express');
const InventoryHistory = require('../models/InventoryHistory');
const { auth, requirePermission } = require('../middleware/auth');
const { catchAsyncErrors, AppError } = require('../middleware/errorHandler');
const { paginationResponse } = require('../middleware/pagination');
const logger = require('../config/logger');

const router = express.Router();

// Get all inventory history
router.get('/', auth, catchAsyncErrors(async (req, res, next) => {
  const total = await InventoryHistory.countDocuments();
  const history = await InventoryHistory.find()
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .populate('product', 'name')
    .sort({ createdAt: -1 })
    .lean();
  logger.info(`Retrieved ${history.length} inventory history records`);
  res.json(paginationResponse(history, total, req.pagination.page, req.pagination.limit));
}));

// Create inventory history entry
router.post('/', auth, requirePermission(['manage_inventory']), catchAsyncErrors(async (req, res, next) => {
  const hist = new InventoryHistory(req.body);
  await hist.save();
  logger.info(`Inventory history created: ${hist._id}`);
  res.status(201).json({ success: true, message: 'History entry created', data: hist });
}));

module.exports = router;