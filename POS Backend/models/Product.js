const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  barcode: {
    type: String,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  minStockLevel: {
    type: Number,
    default: 10
  },
  maxStockLevel: {
    type: Number,
    default: 100
  },
  expiryDate: {
    type: Date
  },
  description: {
    type: String
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  }
}, {
  timestamps: true
});

// Create indexes for performance optimization
productSchema.index({ name: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ category: 1 });
productSchema.index({ supplier: 1 });
productSchema.index({ branch: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ stockQuantity: 1 }); // For inventory checks

module.exports = mongoose.model('Product', productSchema);