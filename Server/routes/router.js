const express = require("express");
const router = express.Router();
const {
  userSignup,
  userLogin,
  userLogout,
  forgotPassword,
} = require("../contollers/userController");
const { userAuth, checkRoleAndPermission } = require("../middlewares/auth");
const Product = require("../models/ProductSchema");
const ProductCategory = require("../models/ProductCategoriesSchema");
const Ingredient = require("../models/IngredientSchema");
const ProductRecipe = require("../models/ProductRecipesSchema");
const StockMovement = require("../models/StockMovementSchema");
const StockLevel = require("../models/StockLevelSchema");

//Registration Route
router.post("/signup", async (req, res) => {
  await userSignup(req.body, req.body.role, res);
});

//Login Route
router.post("/login/:role", async (req, res) => {
  await userLogin(req, res);
});

//LOGOUT
router.post("/logout", userLogout);

//FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// Protected Routes
router.get(
  "/protected",
  userAuth,
  checkRoleAndPermission(["admin", "stockControl"], ["read", "update"]),
  async (req, res) => {
    return res.json(`Welcome ${req.user.fullName}`);
  }
);

let currentId = 0;

function generateId() {
  currentId++;
  return `${currentId}`;
}
//PRODUCT
// Create a new product
router.post("/newProduct", async (req, res) => {
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
});

// Update an existing product
router.patch("/update/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product with the new information
    product.productName = req.body.productName || product.productName;
    product.productDescription =
      req.body.productDescription || product.productDescription;
    product.productCategoriesId =
      req.body.productCategoriesId || product.productCategoriesId;
    product.productUnit = req.body.productUnit || product.productUnit;
    product.productUnitPrice =
      req.body.productUnitPrice || product.productUnitPrice;
    product.productQuantity =
      req.body.productQuantity || product.productQuantity;
    product.productMinimumStock =
      req.body.productMinimumStock || product.productMinimumStock;
    product.productMaximumStock =
      req.body.productMaximumStock || product.productMaximumStock;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get("/allProduct", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific product
router.get("/get/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//INGREDIENT
// Create a new ingredient
router.post("/newIngredient", async (req, res) => {
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
});

// Update an existing ingredient
router.patch("/update/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne({ _id: req.params.id });
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    // Update the ingredient with the new information
    ingredient.ingredientName =
      req.body.ingredientName || ingredient.ingredientName;
    ingredient.ingredientUnit =
      req.body.ingredientUnit || ingredient.ingredientUnit;
    ingredient.ingredientUnitPrice =
      req.body.ingredientUnitPrice || ingredient.ingredientUnitPrice;
    ingredient.ingredientQuantity =
      req.body.ingredientQuantity || ingredient.ingredientQuantity;
    ingredient.ingredientMaximumStock =
      req.body.ingredientMaximumStock || ingredient.ingredientMaximumStock;
    ingredient.ingredientMinimumStock =
      req.body.ingredientMinimumStock || ingredient.ingredientMinimumStock;

    await ingredient.save();
    res.json(ingredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an ingredient
router.delete("/delete/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne({ _id: req.params.id });
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    await ingredient.deleteOne();
    res.json({ message: "Ingredient deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all ingredients
router.get("/allIngredient", async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific ingredient
router.get("/get/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne({ _id: req.params.id });
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//PRODUCT CATEGORY
// Create a new product category
router.post("/newProductCategory", async (req, res) => {
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
});

// Update an existing product category
router.patch("/update/:id", async (req, res) => {
  try {
    const productCategory = await ProductCategory.findOne({
      _id: req.params.id,
    });
    if (!productCategory) {
      return res.status(404).json({ message: "Product category not found" });
    }

    // Update the product category with the new information
    productCategory.categoryName =
      req.body.categoryName || productCategory.categoryName;
    productCategory.categoryDescription =
      req.body.categoryDescription || productCategory.categoryDescription;

    await productCategory.save();
    res.json(productCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product category
router.delete("/delete/:id", async (req, res) => {
  try {
    const productCategory = await ProductCategory.findOne({
      _id: req.params.id,
    });
    if (!productCategory) {
      return res.status(404).json({ message: "Product category not found" });
    }

    await productCategory.deleteOne();
    res.json({ message: "Product category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all product categories
router.get("/allProductCategory", async (req, res) => {
  try {
    const productCategories = await ProductCategory.find();
    res.json(productCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific product category
router.get("/get/:id", async (req, res) => {
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
});

//PRODUCT RECIPE
// Create a new product recipe
router.post("/newProductRecipe", async (req, res) => {
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
});

// Update an existing product recipe
router.patch("/update/:id", async (req, res) => {
  try {
    const productRecipe = await ProductRecipe.findOne({ _id: req.params.id });
    if (!productRecipe) {
      return res.status(404).json({ message: "Product recipe not found" });
    }

    // Update the product recipe with the new information
    productRecipe.ingredients =
      req.body.ingredients || productRecipe.ingredients;
    productRecipe.instructions =
      req.body.instructions || productRecipe.instructions;
    productRecipe.recipeYield =
      req.body.recipeYield || productRecipe.recipeYield;

    await productRecipe.save();
    res.json(productRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product recipe
router.delete("/delete/:id", async (req, res) => {
  try {
    const productRecipe = await ProductRecipe.findOne({ _id: req.params.id });
    if (!productRecipe) {
      return res.status(404).json({ message: "Product recipe not found" });
    }

    await productRecipe.deleteOne();
    res.json({ message: "Product recipe deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all product recipes
router.get("/allProductRecipes", async (req, res) => {
  try {
    const productRecipes = await ProductRecipe.find();
    res.json(productRecipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific product recipe
router.get("/get/:id", async (req, res) => {
  try {
    const productRecipe = await ProductRecipe.findOne({ _id: req.params.id });
    if (!productRecipe) {
      return res.status(404).json({ message: "Product recipe not found" });
    }
    res.json(productRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Calculate production cost
router.post("/:id/cost", async (req, res) => {
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
});

//STOCK MOVEMENT
// Create a new stock movement
router.post("/newStockMovement", async (req, res) => {
  try {
    const {
      stockMovementId,
      productId,
      ingredientId,
      movementType,
      quantity,
      reason,
      user,
    } = req.body;

    // Check if the stock movement already exists
    const existingMovement = await StockMovement.findOne({ stockMovementId });
    if (existingMovement) {
      return res.status(400).json({ message: "Stock movement already exists" });
    }

    // Create a new stock movement
    const stockMovement = new StockMovement({
      stockMovementId: generateId(),
      productId,
      ingredientId,
      movementType,
      quantity,
      reason,
      user,
      createdAt: new Date(),
    });

    await stockMovement.save();

    // Update the corresponding product or ingredient stock level
    if (productId) {
      await updateProductStockLevel(productId, movementType, quantity);
    } else if (ingredientId) {
      await updateIngredientStockLevel(ingredientId, movementType, quantity);
    }

    res.status(201).json(stockMovement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing stock movement
router.patch("/update/:id", async (req, res) => {
  try {
    const stockMovement = await StockMovement.findOne({ _id: req.params.id });
    if (!stockMovement) {
      return res.status(404).json({ message: "Stock movement not found" });
    }

    // Update the stock movement with the new information
    stockMovement.movementType =
      req.body.movementType || stockMovement.movementType;
    stockMovement.quantity = req.body.quantity || stockMovement.quantity;
    stockMovement.reason = req.body.reason || stockMovement.reason;
    stockMovement.user = req.body.user || stockMovement.user;
    stockMovement.updatedAt = new Date();

    await stockMovement.save();

    // Update the corresponding product or ingredient stock level
    if (stockMovement.productId) {
      await updateProductStockLevel(
        stockMovement.productId,
        stockMovement.movementType,
        stockMovement.quantity
      );
    } else if (stockMovement.ingredientId) {
      await updateIngredientStockLevel(
        stockMovement.ingredientId,
        stockMovement.movementType,
        stockMovement.quantity
      );
    }

    res.json(stockMovement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a stock movement
router.delete("/delete/:id", async (req, res) => {
  try {
    const stockMovement = await StockMovement.findOne({ _id: req.params.id });
    if (!stockMovement) {
      return res.status(404).json({ message: "Stock movement not found" });
    }

    // Update the corresponding product or ingredient stock level
    if (stockMovement.productId) {
      await updateProductStockLevel(
        stockMovement.productId,
        stockMovement.movementType,
        -stockMovement.quantity
      );
    } else if (stockMovement.ingredientId) {
      await updateIngredientStockLevel(
        stockMovement.ingredientId,
        stockMovement.movementType,
        -stockMovement.quantity
      );
    }

    await stockMovement.deleteOne();
    res.json({ message: "Stock movement deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all stock movements
router.get("/allStockMovement", async (req, res) => {
  try {
    const stockMovements = await StockMovement.find();
    res.json(stockMovements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific stock movement
router.get("/get/:id", async (req, res) => {
  try {
    const stockMovement = await StockMovement.findOne({ _id: req.params.id });
    if (!stockMovement) {
      return res.status(404).json({ message: "Stock movement not found" });
    }
    res.json(stockMovement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function updateProductStockLevel(productId, movementType, quantity) {
  const product = await Product.findOne({ productId });
  if (movementType === "receipt") {
    product.productQuantity += quantity;
  } else if (movementType === "issue") {
    product.productQuantity -= quantity;
  }
  await product.save();

  // Update the corresponding StockLevel document
  const stockLevel = await StockLevel.findOne({ productId });
  stockLevel.currentQuantity = product.productQuantity;
  await stockLevel.save();
}

async function updateIngredientStockLevel(
  ingredientId,
  movementType,
  quantity
) {
  const ingredient = await Ingredient.findOne({ ingredientId });
  if (movementType === "receipt") {
    ingredient.ingredientQuantity += quantity;
  } else if (movementType === "issue") {
    ingredient.ingredientQuantity -= quantity;
  }
  await ingredient.save();

  // Update the corresponding StockLevel document
  const stockLevel = await StockLevel.findOne({ ingredientId });
  stockLevel.currentQuantity = ingredient.ingredientQuantity;
  await stockLevel.save();
}

//STOCK LEVEL
// Create a new stock level
router.post("/newStockLevel", async (req, res) => {
  try {
    const {
      productId,
      ingredientId,
      currentQuantity,
      minimumQuantity,
      maximumQuantity,
    } = req.body;

    // Check if the stock level already exists
    const existingStockLevel = await StockLevel.findOne({
      $or: [{ productId }, { ingredientId }],
    });
    if (existingStockLevel) {
      return res.status(400).json({ message: "Stock level already exists" });
    }

    // Create a new stock level
    const stockLevel = new StockLevel({
      productId,
      ingredientId,
      currentQuantity,
      minimumQuantity,
      maximumQuantity,
    });

    await stockLevel.save();
    res.status(201).json(stockLevel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing stock level
router.patch("/update/:id", async (req, res) => {
  try {
    const stockLevel = await StockLevel.findOne({ _id: req.params.id });
    if (!stockLevel) {
      return res.status(404).json({ message: "Stock level not found" });
    }

    // Update the stock level with the new information
    stockLevel.currentQuantity =
      req.body.currentQuantity || stockLevel.currentQuantity;
    stockLevel.minimumQuantity =
      req.body.minimumQuantity || stockLevel.minimumQuantity;
    stockLevel.maximumQuantity =
      req.body.maximumQuantity || stockLevel.maximumQuantity;

    await stockLevel.save();
    res.json(stockLevel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a stock level
router.delete("/delete/:id", async (req, res) => {
  try {
    const stockLevel = await StockLevel.findOne({ _id: req.params.id });
    if (!stockLevel) {
      return res.status(404).json({ message: "Stock level not found" });
    }

    await stockLevel.deleteOne();
    res.json({ message: "Stock level deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all stock levels
router.get("/allStockLevel", async (req, res) => {
  try {
    const stockLevels = await StockLevel.find();
    res.json(stockLevels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific stock level
router.get("/get/:id", async (req, res) => {
  try {
    const stockLevel = await StockLevel.findOne({ _id: req.params.id });
    if (!stockLevel) {
      return res.status(404).json({ message: "Stock level not found" });
    }
    res.json(stockLevel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get stock level by product or ingredient
router.get("/search", async (req, res) => {
  try {
    const { productId, ingredientId } = req.query;
    let stockLevel;

    if (productId) {
      stockLevel = await StockLevel.findOne({ productId });
    } else if (ingredientId) {
      stockLevel = await StockLevel.findOne({ ingredientId });
    } else {
      return res
        .status(400)
        .json({ message: "Please provide either productId or ingredientId" });
    }

    if (!stockLevel) {
      return res.status(404).json({ message: "Stock level not found" });
    }

    res.json(stockLevel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
