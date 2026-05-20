const mongoose = require('mongoose');

const inventoryHistorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['add', 'remove', 'adjust', 'sale']
  },
  quantity: {
    type: Number,
    required: true
  },
  previousStock: {
    type: Number
  },
  newStock: {
    type: Number
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryHistory', inventoryHistorySchema);