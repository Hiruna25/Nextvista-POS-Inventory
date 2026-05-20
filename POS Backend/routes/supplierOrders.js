const express = require('express');
const SupplierOrder = require('../models/SupplierOrder');
const { auth, requirePermission } = require('../middleware/auth');
const { catchAsyncErrors, AppError } = require('../middleware/errorHandler');
const { paginationResponse } = require('../middleware/pagination');
const logger = require('../config/logger');

const router = express.Router();

// Get all supplier orders
router.get('/', auth, catchAsyncErrors(async (req, res, next) => {
  const total = await SupplierOrder.countDocuments();
  const orders = await SupplierOrder.find()
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .populate('supplier', 'name')
    .populate('product', 'name')
    .sort({ createdAt: -1 })
    .lean();
  logger.info(`Retrieved ${orders.length} supplier orders`);
  res.json(paginationResponse(orders, total, req.pagination.page, req.pagination.limit));
}));

// Create supplier order
router.post('/', auth, requirePermission(['manage_inventory']), catchAsyncErrors(async (req, res, next) => {
  const order = new SupplierOrder(req.body);
  await order.save();
  logger.info(`Supplier order created: ${order._id}`);
  res.status(201).json({ success: true, message: 'Order created', data: order });
}));

// Update supplier order status
router.put('/:id', auth, requirePermission(['manage_inventory']), catchAsyncErrors(async (req, res, next) => {
  const order = await SupplierOrder.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('supplier', 'name')
    .populate('product', 'name');
  if (!order) throw new AppError('Order not found', 404);
  logger.info(`Supplier order updated: ${req.params.id}`);
  res.json({ success: true, message: 'Order updated', data: order });
}));

module.exports = router;