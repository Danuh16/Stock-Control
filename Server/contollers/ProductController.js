const Product = require("../models/ProductSchema");

let currentId = 0;

function generateId() {
  currentId++;
  return `${currentId}`;
}

// Create a new product
const ProductCreate = async (req, res) => {
    try {
      const {
        productId,
        productName,
        productDescription,
        productCategoriesId,
        productUnit,
        productUnitPrice,
        productQuantity,
        productMinimumStock,
        productMaximumStock,
      } = req.body;
  
      // Check if the product already exists
      const existingProduct = await Product.findOne({ productId });
      if (existingProduct) {
        return res.status(400).json({ message: "Product already exists" });
      }
  
      // Create a new product
      const product = new Product({
        productId: generateId(),
        productName,
        productDescription,
        productCategoriesId,
        productUnit,
        productUnitPrice,
        productQuantity,
        productMinimumStock,
        productMaximumStock,
      });
  
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update an existing product
  const ProductUpdate = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Check if the updated product is used in any product recipes
      const relatedRecipes = await ProductRecipe.find({ productId: id });
  
      // If the product is used in any recipes, check if the update will affect the recipes
      if (relatedRecipes.length > 0) {
        // Perform any necessary checks or validations on the update data to ensure it doesn't break the related recipes
        // For example, you could check if the productUnit or productUnitPrice is being updated, and disallow the update if it would affect the recipes
        if (
          req.body.productUnit !== undefined ||
          req.body.productUnitPrice !== undefined
        ) {
          return res.status(400).json({
            message:
              "Updating the product unit or unit price will affect the related recipes. Please update the recipes first before updating the product.",
          });
        }
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete a product
  const ProductDelete = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the product has any related recipes
      const relatedRecipes = await ProductRecipe.find({ productId: id });
  
      if (relatedRecipes.length > 0) {
        // Warn the user that deleting this product will also delete the related recipes
        return res.status(400).json({
          message:
            "Deleting this product will also delete related recipes. Are you sure you want to proceed?",
        });
      }
  
      // Delete the product
      const deletedProduct = await Product.findByIdAndDelete(id);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // If the product is deleted successfully, also delete the related recipes
      await ProductRecipe.deleteMany({ productId: id });
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get all products
  const GetAllProduct = async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get a specific product
  const GetSpecificProduct = async (req, res) => {
    try {
      const product = await Product.findOne({ _id: req.params.id });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  module.exports={ProductCreate, ProductUpdate, ProductDelete, GetAllProduct, GetSpecificProduct};