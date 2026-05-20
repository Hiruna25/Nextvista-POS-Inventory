const express = require('express');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const { auth, requirePermission } = require('../middleware/auth');
const { catchAsyncErrors, AppError } = require('../middleware/errorHandler');
const { paginationResponse } = require('../middleware/pagination');
const logger = require('../config/logger');

const router = express.Router();

// Get all suppliers
router.get('/', auth, catchAsyncErrors(async (req, res, next) => {
  const total = await Supplier.countDocuments();
  const suppliers = await Supplier.find()
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .lean();
  logger.info(`Retrieved ${suppliers.length} suppliers`);
  res.json(paginationResponse(suppliers, total, req.pagination.page, req.pagination.limit));
}));

// Get supplier by ID
router.get('/:id', auth, catchAsyncErrors(async (req, res, next) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) throw new AppError('Supplier not found', 404);
  res.json({ success: true, data: supplier });
}));

// Get products from supplier
router.get('/:id/products', auth, catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({ supplier: req.params.id })
    .populate('category', 'name')
    .populate('branch', 'name')
    .lean();
  res.json({ success: true, data: products });
}));

// Create supplier
router.post('/', auth, requirePermission(['manage_products']), catchAsyncErrors(async (req, res, next) => {
  const supplier = new Supplier(req.body);
  await supplier.save();
  logger.info(`Supplier created: ${supplier._id}`);
  res.status(201).json({ success: true, message: 'Supplier created', data: supplier });
}));

// Update supplier
router.put('/:id', auth, requirePermission(['manage_products']), catchAsyncErrors(async (req, res, next) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!supplier) throw new AppError('Supplier not found', 404);
  logger.info(`Supplier updated: ${req.params.id}`);
  res.json({ success: true, message: 'Supplier updated', data: supplier });
}));

// Delete supplier
router.delete('/:id', auth, requirePermission(['manage_products']), catchAsyncErrors(async (req, res, next) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);
  if (!supplier) throw new AppError('Supplier not found', 404);
  logger.info(`Supplier deleted: ${req.params.id}`);
  res.json({ success: true, message: 'Supplier deleted' });
}));

module.exports = router;