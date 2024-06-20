const ProductCategory = require("../models/ProductCategoriesSchema");

let currentId = 0;

function generateId() {
  currentId++;
  return `${currentId}`;
}

// Create a new product category
const CategoryCreate = async (req, res) => {
  try {
    const { categoryId, categoryName, categoryDescription } = req.body;

    // Check if the product category already exists
    const existingCategory = await ProductCategory.findOne({ categoryId });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Product category already exists" });
    }

    // Create a new product category
    const productCategory = new ProductCategory({
      categoryId: generateId(),
      categoryName,
      categoryDescription,
    });

    await productCategory.save();
    res.status(201).json(productCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing product category
const CategoryUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await ProductCategory.findById(id);

    if (!productCategory) {
      return res.status(404).json({ message: "Product category not found" });
    }

    // Check if the updated product category is used by any products
    const relatedProducts = await Product.find({ productCategoriesId: id });

    // If the product category is used by any products, check if the update will affect the products
    if (relatedProducts.length > 0) {
      // Perform any necessary checks or validations on the update data to ensure it doesn't break the related products
      // For example, you could disallow updating the categoryName or categoryDescription if there are related products
      if (
        req.body.categoryName !== undefined ||
        req.body.categoryDescription !== undefined
      ) {
        return res.status(400).json({
          message:
            "Updating the product category name or description will affect the related products. Please update the products first before updating the product category.",
        });
      }
    }

    const updatedProductCategory = await ProductCategory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedProductCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product category
const CategoryDelete = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the product category is used by any products
    const relatedProducts = await Product.find({ productCategoriesId: id });

    if (relatedProducts.length > 0) {
      // Warn the user that deleting this product category will also delete the related products
      return res.status(400).json({
        message:
          "Deleting this product category will also delete related products. Are you sure you want to proceed?",
      });
    }

    // Delete the product category
    const deletedProductCategory = await ProductCategory.findByIdAndDelete(id);

    if (!deletedProductCategory) {
      return res.status(404).json({ message: "Product category not found" });
    }

    // If the product category is deleted successfully, also update the related products
    await Product.updateMany(
      { productCategoriesId: id },
      { $pull: { productCategoriesId: id } }
    );

    res.status(200).json({ message: "Product category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all product categories
const GetAllCategory = async (req, res) => {
  try {
    const productCategories = await ProductCategory.find();
    res.json(productCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific product category
const GetSpecificCategory = async (req, res) => {
  try {
    const productCategory = await ProductCategory.findOne({
      _id: req.params.id,
    });
    if (!productCategory) {
      return res.status(404).json({ message: "Product category not found" });
    }
    res.json(productCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  CategoryCreate,
  CategoryUpdate,
  CategoryDelete,
  GetAllCategory,
  GetSpecificCategory,
};
