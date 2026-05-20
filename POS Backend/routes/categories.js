const express = require('express');
const Category = require('../models/Category');
const { auth, requirePermission } = require('../middleware/auth');
const { catchAsyncErrors, AppError } = require('../middleware/errorHandler');
const { paginationResponse } = require('../middleware/pagination');
const logger = require('../config/logger');

const router = express.Router();

// Get all categories
router.get('/', auth, catchAsyncErrors(async (req, res, next) => {
  const total = await Category.countDocuments();
  const categories = await Category.find()
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .lean();
  logger.info(`Retrieved ${categories.length} categories`);
  res.json(paginationResponse(categories, total, req.pagination.page, req.pagination.limit));
}));

// Create category
router.post('/', auth, requirePermission(['manage_products']), catchAsyncErrors(async (req, res, next) => {
  const category = new Category(req.body);
  await category.save();
  logger.info(`Category created: ${category._id}`);
  res.status(201).json({ success: true, message: 'Category created', data: category });
}));

// Update category
router.put('/:id', auth, requirePermission(['manage_products']), catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) throw new AppError('Category not found', 404);
  logger.info(`Category updated: ${req.params.id}`);
  res.json({ success: true, message: 'Category updated', data: category });
}));

// Delete category
router.delete('/:id', auth, requirePermission(['manage_products']), catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new AppError('Category not found', 404);
  logger.info(`Category deleted: ${req.params.id}`);
  res.json({ success: true, message: 'Category deleted' });
}));

module.exports = router;