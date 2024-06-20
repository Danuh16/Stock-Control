const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ingredientUnit =require('../constants/Constants')

const ingredientSchema = new mongoose.Schema({
  ingredientId: {
    type: String,
    required: true,
    unique: true
  },
  ingredientName: {
    type: String,
    required: true
  },
  ingredientUnit: {
    type: String,
    required: true,
   enum: Object.values(ingredientUnit)
  },
  ingredientUnitPrice: {
    type: Number,
    required: true
  },
  ingredientQuantity: {
    type: Number,
    required: true
  },
  ingredientMaximumStock: {
    type: Number,
    required: true
  },
  ingredientMinimumStock: {
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

module.exports = mongoose.model('Ingredient', ingredientSchema);