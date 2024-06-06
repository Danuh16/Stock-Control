const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  productName: {
    type: String,
    required: true
  },
  productDescription: {
    type: String,
    required: true
  },
  productCategoriesId: {
    type: [String],
    required: true
  },
  productUnit: {
    type: String,
    required: true,
    enum: ['litre', 'gram', 'pieces']
  },
  productUnitPrice: {
    type: Number,
    required: true
  },
  productQuantity: {
    type: Number,
    required: true
  },
  productMinimumStock: {
    type: Number,
    required: true
  },
  productMaximumStock: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);