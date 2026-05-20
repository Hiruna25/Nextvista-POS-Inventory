const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, requirePermission } = require('../middleware/auth');
const { catchAsyncErrors, AppError } = require('../middleware/errorHandler');
const { paginationResponse } = require('../middleware/pagination');
const logger = require('../config/logger');

const router = express.Router();

// Get current user profile
router.get('/profile', auth, catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, data: user });
}));

// Update current user profile
router.put('/profile', auth, catchAsyncErrors(async (req, res, next) => {
  const { email, username } = req.body;
  const updates = {};
  
  if (email) updates.email = email;
  if (username) updates.username = username;

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  if (!user) throw new AppError('User not found', 404);
  logger.info(`User profile updated: ${req.user.id}`);
  res.json({ success: true, message: 'Profile updated', data: user });
}));

// Change password
router.post('/profile/change-password', auth, catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError('User not found', 404);

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  logger.info(`Password changed for user: ${req.user.id}`);
  res.json({ success: true, message: 'Password changed successfully' });
}));

// Get all users (admin only)
router.get('/', auth, requirePermission(['manage_users']), catchAsyncErrors(async (req, res, next) => {
  const total = await User.countDocuments();
  const users = await User.find()
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .select('-password')
    .lean();
  logger.info(`Retrieved ${users.length} users`);
  res.json(paginationResponse(users, total, req.pagination.page, req.pagination.limit));
}));

// Get user by ID (admin only)
router.get('/:id', auth, requirePermission(['manage_users']), catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, data: user });
}));

// Create user (admin only)
router.post('/', auth, requirePermission(['manage_users']), catchAsyncErrors(async (req, res, next) => {
  const { username, email, password, roles, permissions } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    roles,
    permissions
  });
  await user.save();
  logger.info(`User created: ${user._id}`);
  res.status(201).json({ success: true, message: 'User created', data: user });
}));

// Update user (admin only)
router.put('/:id', auth, requirePermission(['manage_users']), catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  if (!user) throw new AppError('User not found', 404);
  logger.info(`User updated: ${req.params.id}`);
  res.json({ success: true, message: 'User updated', data: user });
}));

// Delete user (admin only)
router.delete('/:id', auth, requirePermission(['manage_users']), catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  logger.info(`User deleted: ${req.params.id}`);
  res.json({ success: true, message: 'User deleted' });
}));

module.exports = router;
