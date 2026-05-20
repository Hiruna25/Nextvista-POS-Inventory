const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { catchAsyncErrors, AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', validate(schemas.register), catchAsyncErrors(async (req, res, next) => {
  const { username, email, password, roles, permissions } = req.validated;
  
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    logger.warn(`Registration attempt with existing username/email: ${email}`);
    throw new AppError('Username or email already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword, roles, permissions });
  await user.save();
  
  logger.info(`New user registered: ${username}`);
  res.status(201).json({ 
    success: true,
    message: 'User registered successfully',
    user: { id: user._id, username: user.username, email: user.email }
  });
}));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(schemas.login), catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.validated;
  
  const user = await User.findOne({
    $or: [
      { username },
      { email: username }
    ]
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    logger.warn(`Failed login attempt for: ${username}`);
    throw new AppError('Invalid username or password', 401);
  }

  const token = jwt.sign(
    { id: user._id, username: user.username, roles: user.roles, permissions: user.permissions },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  logger.info(`User logged in: ${username}`);
  res.json({ 
    success: true,
    token, 
    user: { id: user._id, username: user.username, email: user.email, roles: user.roles, permissions: user.permissions } 
  });
}));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', auth, (req, res) => {
  logger.info(`User logged out: ${req.user.username}`);
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post('/refresh', auth, (req, res) => {
  const token = jwt.sign(
    { id: req.user.id, username: req.user.username, roles: req.user.roles, permissions: req.user.permissions },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  logger.info(`Token refreshed for: ${req.user.username}`);
  res.json({ success: true, token });
});

module.exports = router;