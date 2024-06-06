const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductCategorySchema = new Schema(
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);