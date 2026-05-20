const Joi = require('joi');
const logger = require('../config/logger');

// Validation schemas
const schemas = {
  // Auth schemas
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    roles: Joi.array().items(Joi.string().valid('admin', 'manager', 'user')),
    permissions: Joi.array().items(
      Joi.string().valid('manage_products', 'manage_inventory', 'view_reports', 'manage_users')
    ),
  }),

  login: Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().required(),
  }),

  // Product schemas
  createProduct: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    supplier: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    barcode: Joi.string().optional(), // Remove .unique() - handled by database
    price: Joi.number().positive().required(),
    cost: Joi.number().positive().required(),
    stockQuantity: Joi.number().integer().min(0).required(),
    reorderLevel: Joi.number().integer().min(0),
    description: Joi.string().max(500),
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(2).max(100),
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    supplier: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    barcode: Joi.string().optional(), // Remove .unique() - handled by database
    price: Joi.number().positive(),
    cost: Joi.number().positive(),
    stockQuantity: Joi.number().integer().min(0),
    reorderLevel: Joi.number().integer().min(0),
    description: Joi.string().max(500),
  }),

  // Category schemas
  createCategory: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(300),
  }),

  // Supplier schemas
  createSupplier: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email(),
    phone: Joi.string(),
    address: Joi.string().max(500),
    city: Joi.string().max(50),
    country: Joi.string().max(50),
    paymentTerms: Joi.string(),
  }),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string(),
  }),
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      logger.warn({
        message: 'Validation error',
        path: req.path,
        errors: error.details.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    req.validated = value;
    next();
  };
};

// Query validation middleware
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        errors: error.details.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    req.query = value;
    next();
  };
};

module.exports = { schemas, validate, validateQuery };
