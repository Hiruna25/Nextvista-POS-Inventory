const dotenv = require('dotenv');
dotenv.config({ override: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const bcrypt = require('bcryptjs');

// Logger
const logger = require('./config/logger');

// Models
const User = require('./models/User');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');
const Branch = require('./models/Branch');

// Middleware
const { errorHandler } = require('./middleware/errorHandler');
const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');
const { paginate } = require('./middleware/pagination');
const { setupSwagger } = require('./config/swagger');

// DNS configuration
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const PORT = process.env.PORT || 3001;

// API Documentation
setupSwagger(app);

// Basic Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Apply general rate limiter
app.use('/api/', generalLimiter);

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pos_inventory';
logger.info(`MongoDB URI loaded: ${mongoUri.startsWith('mongodb+srv') ? 'Atlas cluster' : mongoUri}`);

async function seedInitialData() {
  try {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({
      $or: [
        { email: adminEmail },
        { username: 'Admin' }
      ]
    });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin123', 10);
      await User.create({
        username: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        roles: ['admin'],
        permissions: ['manage_products', 'manage_inventory', 'view_reports']
      });
      logger.info('Default admin user created.');
    } else {
      logger.info('Default admin user already exists.');
    }

    const defaultCategory = await Category.findOne({ name: 'General' });
    if (!defaultCategory) {
      await Category.create({ name: 'General', description: 'Default category' });
      logger.info('Default category created.');
    }

    const defaultSupplier = await Supplier.findOne({ name: 'Default Supplier' });
    if (!defaultSupplier) {
      await Supplier.create({
        name: 'Default Supplier',
        contact: 'Supplier Contact',
        email: 'supplier@example.com',
        address: 'Default address'
      });
      logger.info('Default supplier created.');
    }

    const defaultBranch = await Branch.findOne({ name: 'Main Branch' });
    if (!defaultBranch) {
      await Branch.create({ name: 'Main Branch', location: 'Main location' });
      logger.info('Default branch created.');
    }
  } catch (error) {
    logger.error('Error seeding initial data:', error);
  }
}

const mongooseOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  family: 4,
  retryWrites: true,
  retryReads: true,
};

mongoose.connect(mongoUri, mongooseOptions)
  .then(async () => {
    logger.info('✅ Connected to MongoDB successfully');
    await seedInitialData();
  })
  .catch(err => {
    logger.error('❌ MongoDB connection error:', err.message);
    logger.error('Connection URI:', mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':$1****@'));
    process.exit(1);
  });

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/users', paginate, require('./routes/users'));
app.use('/api/categories', paginate, require('./routes/categories'));
app.use('/api/suppliers', paginate, require('./routes/suppliers'));
app.use('/api/branches', paginate, require('./routes/branches'));
app.use('/api/products', paginate, require('./routes/products'));
app.use('/api/inventory-history', paginate, require('./routes/inventoryHistory'));
app.use('/api/supplier-orders', paginate, require('./routes/supplierOrders'));
app.use('/api/pos-transactions', paginate, require('./routes/posTransactions'));
app.use('/api/external', require('./routes/externalIntegration'));
app.use('/api', require('./routes/seed'));

// Health check
app.get('/api/health', (req, res) => {
  logger.info('Health check request');
  res.json({ success: true, status: 'OK', message: 'Server is running' });
});

// API Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  logger.info(`❤️  Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;