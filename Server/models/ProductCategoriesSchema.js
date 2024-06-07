const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productCategorySchema = new Schema(
  {
    categoryId: {
      type: String,
      required: true,
      unique: true,
      _id: true
    },
    categoryName: {
      type: String,
      required: true
    },
    categoryDescription: {
      type: String,
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
  },
);

module.exports = mongoose.model('ProductCategory', productCategorySchema);