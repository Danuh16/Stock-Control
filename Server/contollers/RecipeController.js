const ProductRecipe = require("../models/ProductRecipesSchema");

let currentId = 0;

function generateId() {
  currentId++;
  return `${currentId}`;
}


// Create a new product recipe
const RecipeCreate = async (req, res) => {
    try {
      const {
        recipeId,
        productId,
        ingredients,
        instructions,
        yield: recipeYield,
      } = req.body;
  
      // Check if the product recipe already exists
      const existingRecipe = await ProductRecipe.findOne({ recipeId });
      if (existingRecipe) {
        return res.status(400).json({ message: "Product recipe already exists" });
      }
  
      // Create a new product recipe
      const productRecipe = new ProductRecipe({
        recipeId: generateId(),
        productId,
        ingredients,
        instructions,
        recipeYield,
      });
  
      await productRecipe.save();
      res.status(201).json(productRecipe);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update an existing product recipe
 const RecipeUpdate = async (req, res) => {
    try {
      const { id } = req.params;
      const productRecipe = await ProductRecipe.findById(id);
  
      if (!productRecipe) {
        return res.status(404).json({ message: "Product recipe not found" });
      }
  
      // Check if the updated product recipe is related to a valid product
      const product = await Product.findById(productRecipe.productId);
      if (!product) {
        return res.status(400).json({
          message: "The product recipe is related to an invalid product.",
        });
      }
  
      // Check if the updated product recipe is related to valid ingredients
      for (const ingredient of req.body.ingredients || []) {
        const ingredientItem = await Ingredient.findById(ingredient.ingredientId);
        if (!ingredientItem) {
          return res.status(400).json({
            message: `The product recipe is related to an invalid ingredient: ${ingredient.ingredientId}.`,
          });
        }
      }
  
      const updatedProductRecipe = await ProductRecipe.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );
  
      res.status(200).json(updatedProductRecipe);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete a product recipe
 const RecipeDelete = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Delete the product recipe
      const deletedProductRecipe = await ProductRecipe.findByIdAndDelete(id);
  
      if (!deletedProductRecipe) {
        return res.status(404).json({ message: "Product recipe not found" });
      }
  
      res.status(200).json({ message: "Product recipe deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get all product recipes
const GetAllRecipe = async (req, res) => {
    try {
      const productRecipes = await ProductRecipe.find();
      res.json(productRecipes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get a specific product recipe
 const GetSpecificRecipe = async (req, res) => {
    try {
      const productRecipe = await ProductRecipe.findOne({ _id: req.params.id });
      if (!productRecipe) {
        return res.status(404).json({ message: "Product recipe not found" });
      }
      res.json(productRecipe);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Calculate production cost
  const ProductionCost = async (req, res) => {
    try {
      const productRecipe = await ProductRecipe.findOne({ _id: req.params.id });
      if (!productRecipe) {
        return res.status(404).json({ message: "Product recipe not found" });
      }
  
      let totalCost = 0;
      for (const ingredient of productRecipe.ingredients) {
        const { ingredientId, ingredientQuantity } = ingredient;
        const ingredientDetails = await Ingredient.findOne({ ingredientId });
        totalCost += ingredientDetails.ingredientUnitPrice * ingredientQuantity;
      }
  
      res.json({ totalCost });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  module.exports = {
    RecipeCreate,
    RecipeUpdate,
    RecipeDelete,
    GetAllRecipe,
    GetSpecificRecipe,
    ProductionCost,
  };