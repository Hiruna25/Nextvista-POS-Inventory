const express = require('express');
const Product = require('../models/Product');
const InventoryHistory = require('../models/InventoryHistory');
const { auth, requirePermission } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { catchAsyncErrors, AppError } = require('../middleware/errorHandler');
const { paginationResponse } = require('../middleware/pagination');
const logger = require('../config/logger');

const router = express.Router();

// Helper function to convert frontend field names to backend model names
const normalizeProductData = (data) => {
  const normalized = { ...data };
  
  // Map snake_case field names to camelCase
  if ('stock_quantity' in normalized) {
    normalized.stockQuantity = normalized.stock_quantity;
    delete normalized.stock_quantity;
  }
  if ('min_stock_level' in normalized) {
    normalized.minStockLevel = normalized.min_stock_level;
    delete normalized.min_stock_level;
  }
  if ('max_stock_level' in normalized) {
    normalized.maxStockLevel = normalized.max_stock_level;
    delete normalized.max_stock_level;
  }
  if ('category_id' in normalized) {
    normalized.category = normalized.category_id;
    delete normalized.category_id;
  }
  if ('supplier_id' in normalized) {
    normalized.supplier = normalized.supplier_id;
    delete normalized.supplier_id;
  }
  if ('low_stock_threshold' in normalized) {
    normalized.minStockLevel = normalized.low_stock_threshold;
    delete normalized.low_stock_threshold;
  }
  if ('daily_sales' in normalized) {
    // Store in description if needed, or handle separately
    delete normalized.daily_sales;
  }
  
  return normalized;
};

// Get all products
router.get('/', auth, catchAsyncErrors(async (req, res, next) => {
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
  
  logger.info(`Retrieved ${products.length} products for user ${req.user.username}`);
  res.json(paginationResponse(products, total, req.pagination.page, req.pagination.limit));
}));

// Get product by ID
router.get('/:id', auth, catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name')
    .populate('supplier', 'name')
    .populate('branch', 'name');
  
  if (!product) {
    logger.warn(`Product not found: ${req.params.id}`);
    throw new AppError('Product not found', 404);
  }
  
  res.json({ success: true, data: product });
}));

// Create product
router.post('/', auth, requirePermission(['manage_products']), validate(schemas.createProduct), catchAsyncErrors(async (req, res, next) => {
  const normalizedData = normalizeProductData(req.validated);
  const product = new Product(normalizedData);
  await product.save();
  logger.info(`Product created: ${product._id} by user ${req.user.username}`);
  res.status(201).json({ success: true, message: 'Product created', data: product });
}));

// Update product
router.put('/:id', auth, requirePermission(['manage_products']), validate(schemas.updateProduct), catchAsyncErrors(async (req, res, next) => {
  const normalizedData = normalizeProductData(req.validated);
  logger.info(`Updating product: ${req.params.id} by user ${req.user.username}`);
  
  const product = await Product.findByIdAndUpdate(req.params.id, normalizedData, { new: true, runValidators: true })
    .populate('category', 'name')
    .populate('supplier', 'name')
    .populate('branch', 'name');
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  
  logger.info(`Product updated: ${req.params.id}`);
  res.json({ success: true, message: 'Product updated', data: product });
}));

// Delete product
router.delete('/:id', auth, requirePermission(['manage_products']), catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  
  logger.info(`Product deleted: ${req.params.id} by user ${req.user.username}`);
  res.json({ success: true, message: 'Product deleted' });
}));

// Adjust stock
router.post('/:id/adjust-stock', auth, requirePermission(['manage_inventory']), catchAsyncErrors(async (req, res, next) => {
  const { quantity, action, notes } = req.body;
  
  if (!quantity || !action) {
    throw new AppError('quantity and action are required', 400);
  }
  
  if (!['add', 'remove', 'set'].includes(action)) {
    throw new AppError('Invalid action. Must be add, remove, or set', 400);
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const previousStock = product.stockQuantity;
  if (action === 'add') {
    product.stockQuantity += quantity;
  } else if (action === 'remove') {
    product.stockQuantity -= quantity;
  } else if (action === 'set') {
    product.stockQuantity = quantity;
  }
  await product.save();

  const history = new InventoryHistory({
    product: req.params.id,
    action,
    quantity,
    previousStock,
    newStock: product.stockQuantity,
    notes
  });
  await history.save();

  logger.info(`Stock adjusted for product ${req.params.id}: ${action} ${quantity} by user ${req.user.username}`);
  res.json({ success: true, message: 'Stock adjusted', data: product });
}));

module.exports = router;