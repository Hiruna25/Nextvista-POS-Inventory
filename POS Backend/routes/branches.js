const express = require('express');
const Branch = require('../models/Branch');
const { auth, requirePermission } = require('../middleware/auth');
const { catchAsyncErrors, AppError } = require('../middleware/errorHandler');
const { paginationResponse } = require('../middleware/pagination');
const logger = require('../config/logger');

const router = express.Router();

// Get all branches
router.get('/', auth, catchAsyncErrors(async (req, res, next) => {
  const total = await Branch.countDocuments();
  const branches = await Branch.find()
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .lean();
  logger.info(`Retrieved ${branches.length} branches`);
  res.json(paginationResponse(branches, total, req.pagination.page, req.pagination.limit));
}));

// Create branch
router.post('/', auth, requirePermission(['manage_products']), catchAsyncErrors(async (req, res, next) => {
  const branch = new Branch(req.body);
  await branch.save();
  logger.info(`Branch created: ${branch._id}`);
  res.status(201).json({ success: true, message: 'Branch created', data: branch });
}));

// Update branch
router.put('/:id', auth, requirePermission(['manage_products']), catchAsyncErrors(async (req, res, next) => {
  const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!branch) throw new AppError('Branch not found', 404);
  logger.info(`Branch updated: ${req.params.id}`);
  res.json({ success: true, message: 'Branch updated', data: branch });
}));

// Delete branch
router.delete('/:id', auth, requirePermission(['manage_products']), catchAsyncErrors(async (req, res, next) => {
  const branch = await Branch.findByIdAndDelete(req.params.id);
  if (!branch) throw new AppError('Branch not found', 404);
  logger.info(`Branch deleted: ${req.params.id}`);
  res.json({ success: true, message: 'Branch deleted' });
}));

module.exports = router;