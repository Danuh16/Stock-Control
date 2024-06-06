const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockMovementSchema = new mongoose.Schema({
  stockMovementId: {
    type: String,
    required: true,
    unique: true
  },
  productId: {
    type: String,
    required: function() {
      return this.ingredientId === undefined;
    }
  },
  ingredientId: {
    type: String,
    required: function() {
      return this.productId === undefined;
    }
  },
  movementType: {
    type: String,
    required: true,
    enum: ['receipt', 'issue']
  },
  quantity: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StockMovement', stockMovementSchema);