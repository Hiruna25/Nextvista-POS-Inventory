const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'user'
  }],
  permissions: [{
    type: String,
    enum: ['manage_products', 'manage_inventory', 'view_reports', 'manage_users'],
    default: []
  }]
}, {
  timestamps: true
});

// Create indexes for performance optimization
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);