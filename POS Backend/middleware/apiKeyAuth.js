const logger = require('../config/logger');

const apiKeyAuth = (req, res, next) => {
  const incomingKey = req.header('x-api-key') || req.query.api_key || req.body.api_key;
  const expectedKey = process.env.BILLING_API_KEY;

  if (!incomingKey) {
    logger.warn('External integration request rejected: missing API key');
    return res.status(401).json({ success: false, message: 'API key required' });
  }

  if (!expectedKey || incomingKey !== expectedKey) {
    logger.warn('External integration request rejected: invalid API key');
    return res.status(403).json({ success: false, message: 'Invalid API key' });
  }

  next();
};

module.exports = { apiKeyAuth };