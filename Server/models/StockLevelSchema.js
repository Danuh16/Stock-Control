const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockLevelSchema = new mongoose.Schema({
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
  currentQuantity: {
    type: Number,
    required: true
  },
  minimumQuantity: {
    type: Number,
    required: true
  },
  maximumQuantity: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StockLevel', stockLevelSchema);