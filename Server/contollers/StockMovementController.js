const StockMovement = require("../models/StockMovementSchema");
const StockLevel = require("../models/StockLevelSchema");
const Ingredient = require("../models/IngredientSchema");
const Product = require("../models/ProductSchema");

let currentId = 0;

function generateId() {
  currentId++;
  return `${currentId}`;
}



// Create a new stock movement
const StockMovementCreate = async (req, res) => {
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
  };
  
  // Update an existing stock movement
  const StockMovementUpdate = async (req, res) => {
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
  
    async function updateProductStockLevel(productId, movementType, quantity) {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
  
      if (movementType === "IN") {
        product.currentStock += quantity;
      } else if (movementType === "OUT") {
        product.currentStock -= quantity;
      }
  
      await product.save();
    }
  
    async function updateIngredientStockLevel(
      ingredientId,
      movementType,
      quantity
    ) {
      const ingredient = await Ingredient.findById(ingredientId);
      if (!ingredient) {
        throw new Error("Ingredient not found");
      }
  
      if (movementType === "IN") {
        ingredient.currentStock += quantity;
      } else if (movementType === "OUT") {
        ingredient.currentStock -= quantity;
      }
  
      await ingredient.save();
    }
  };
  
  // Delete a stock movement
  const StockMovementDelete = async (req, res) => {
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
  };
  
  // Get all stock movements
  const GetAllStockMovement = async (req, res) => {
    try {
      const stockMovements = await StockMovement.find();
      res.json(stockMovements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get a specific stock movement
  const GetSpecificStockMovement = async (req, res) => {
    try {
      const stockMovement = await StockMovement.findOne({ _id: req.params.id });
      if (!stockMovement) {
        return res.status(404).json({ message: "Stock movement not found" });
      }
      res.json(stockMovement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
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

  module.exports = {
    StockMovementCreate,
    StockMovementUpdate,
    StockMovementDelete,
    GetAllStockMovement,
    GetSpecificStockMovement,
  };