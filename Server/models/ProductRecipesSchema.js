const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productRecipeSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
    unique: true
  },
  productId: {
    type: String,
    required: true
  },
  ingredients: [
    {
      ingredientId: {
        type: String,
        required: true
      },
      ingredientQuantity: {
        type: Number,
        required: true
      }
    }
  ],
  instructions: {
    type: String,
    required: true
  },
  recipeYield: {
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

module.exports = mongoose.model('ProductRecipe', productRecipeSchema);