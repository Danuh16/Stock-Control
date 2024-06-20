const Ingredient = require("../models/IngredientSchema");

let currentId = 0;

function generateId() {
  currentId++;
  return `${currentId}`;
}

// Create a new ingredient
const IngredientCreate = async (req, res) => {
  try {
    const {
      ingredientId,
      ingredientName,
      ingredientUnit,
      ingredientUnitPrice,
      ingredientQuantity,
      ingredientMaximumStock,
      ingredientMinimumStock,
    } = req.body;

    // Check if the ingredient already exists
    const existingIngredient = await Ingredient.findOne({ ingredientId });
    if (existingIngredient) {
      return res.status(400).json({ message: "Ingredient already exists" });
    }

    // Create a new ingredient
    const ingredient = new Ingredient({
      ingredientId: generateId(),
      ingredientName,
      ingredientUnit,
      ingredientUnitPrice,
      ingredientQuantity,
      ingredientMaximumStock,
      ingredientMinimumStock,
    });

    await ingredient.save();
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing ingredient
const IngredientUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findById(id);

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    // Check if the updated ingredient is used in any product recipes
    const relatedRecipes = await ProductRecipe.find({
      "ingredients.ingredientId": id,
    });

    // If the ingredient is used in any recipes, check if the update will affect the recipes
    if (relatedRecipes.length > 0) {
      // Perform any necessary checks or validations on the update data to ensure it doesn't break the related recipes
      // For example, you could check if the ingredientUnit or ingredientUnitPrice is being updated, and disallow the update if it would affect the recipes
      if (
        req.body.ingredientUnit !== undefined ||
        req.body.ingredientUnitPrice !== undefined
      ) {
        return res.status(400).json({
          message:
            "Updating the ingredient unit or unit price will affect the related recipes. Please update the recipes first before updating the ingredient.",
        });
      }
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an ingredient
const IngredientDelete = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ingredient is used in any product recipes
    const relatedRecipes = await ProductRecipe.find({
      "ingredients.ingredientId": id,
    });

    if (relatedRecipes.length > 0) {
      // Warn the user that deleting this ingredient will also delete the related recipes
      return res.status(400).json({
        message:
          "Deleting this ingredient will also delete related recipes. Are you sure you want to proceed?",
      });
    }

    // Delete the ingredient
    const deletedIngredient = await Ingredient.findByIdAndDelete(id);

    if (!deletedIngredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    // If the ingredient is deleted successfully, also delete the related recipes
    await ProductRecipe.updateMany(
      { "ingredients.ingredientId": id },
      { $pull: { ingredients: { ingredientId: id } } }
    );

    res.status(200).json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all ingredients
const GetAllIngredient = async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific ingredient
const GetSpecificIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne({ _id: req.params.id });
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  IngredientCreate,
  IngredientUpdate,
  IngredientDelete,
  GetAllIngredient,
  GetSpecificIngredient,
};
