const express = require("express");
const router = express.Router();
const {
  userSignup,
  userLogin,
  userLogout,
  updateUser,
  deleteUser,
  GetAllUser
} = require("../contollers/userController");
const User = require("../models/UserSchema");
const userAuth = require('../middlewares/auth');
const { getRoles, getRole } = require('../contollers/RoleController');
const { getPermissionsByRole } = require('../contollers/PermissionController');
const { assignPermission } = require('../contollers/PermissionAssignController');
const {
  ProductCreate,
  ProductUpdate,
  ProductDelete,
  GetAllProduct,
  GetSpecificProduct,
} = require("../contollers/ProductController");
const {
  IngredientCreate,
  IngredientUpdate,
  IngredientDelete,
  GetAllIngredient,
  GetSpecificIngredient,
} = require("../contollers/IngredientController");
const {
  CategoryCreate,
  CategoryUpdate,
  CategoryDelete,
  GetAllCategory,
  GetSpecificCategory,
} = require("../contollers/CategoryController");
const {
  RecipeCreate,
  RecipeUpdate,
  RecipeDelete,
  GetAllRecipe,
  GetSpecificRecipe,
  ProductionCost,
} = require("../contollers/RecipeController");
const {
  StockMovementCreate,
  StockMovementUpdate,
  StockMovementDelete,
  GetAllStockMovement,
  GetSpecificStockMovement,
} = require("../contollers/StockMovementController");


/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully signed up.
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 */
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

//GET ALL USERS
router.get("/userList",GetAllUser);

// UPDATE USER
router.patch("/user/update/:id", userAuth, updateUser);
// DELETE USER
router.delete("/user/delete/:id", userAuth, deleteUser);

// ROLE GET
router.get('/roles', getRoles);
router.get('/roles/:id', getRole);

// PERMISSION
router.get('/roles/:roleId/permissions', getPermissionsByRole);
router.post('/permissions/assign', assignPermission);

// PRODUCT
router.post("/newProduct", ProductCreate);
router.patch("/product/update/:id", ProductUpdate);
router.delete("/product/delete/:id", ProductDelete);
router.get("/allProduct", GetAllProduct);
router.get("/get/:id", GetSpecificProduct);

//INGREDIENT
router.post("/newIngredient", IngredientCreate);
router.patch("/ingredient/update/:id", IngredientUpdate);
router.delete("/ingredient/delete/:id", IngredientDelete);
router.get("/allIngredient", GetAllIngredient);
router.get("/get/:id", GetSpecificIngredient);

//PRODUCT CATEGORY
router.post("/newProductCategory", CategoryCreate);
router.patch("/productCategory/update/:id", CategoryUpdate);
router.delete("/productCategory/delete/:id", CategoryDelete);
router.get("/allProductCategory", GetAllCategory);
router.get("/get/:id", GetSpecificCategory);

//PRODUCT RECIPE
router.post("/newProductRecipe", RecipeCreate);
router.patch("/productRecipe/update/:id", RecipeUpdate);
router.delete("/productRecipe/delete/:id", RecipeDelete);
router.get("/allProductRecipes", GetAllRecipe);
router.get("/get/:id", GetSpecificRecipe);
router.post("/:id/cost", ProductionCost);

//STOCK MOVEMENT
router.post("/newStockMovement", StockMovementCreate);
router.patch("/stockMovement/update/:id", StockMovementUpdate);
router.delete("/stockMovement/delete/:id", StockMovementDelete);
router.get("/allStockMovement", GetAllStockMovement);
router.get("/get/:id", GetSpecificStockMovement);

//STOCK LEVEL
// // Create a new stock level
// router.post("/newStockLevel", async (req, res) => {
//   try {
//     const {
//       productId,
//       ingredientId,
//       currentQuantity,
//       minimumQuantity,
//       maximumQuantity,
//     } = req.body;

//     // Check if the stock level already exists
//     const existingStockLevel = await StockLevel.findOne({
//       $or: [{ productId }, { ingredientId }],
//     });
//     if (existingStockLevel) {
//       return res.status(400).json({ message: "Stock level already exists" });
//     }

//     // Create a new stock level
//     const stockLevel = new StockLevel({
//       productId,
//       ingredientId,
//       currentQuantity,
//       minimumQuantity,
//       maximumQuantity,
//     });

//     await stockLevel.save();
//     res.status(201).json(stockLevel);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update an existing stock level
// router.patch("/update/:id", async (req, res) => {
//   try {
//     const stockLevel = await StockLevel.findOne({ _id: req.params.id });
//     if (!stockLevel) {
//       return res.status(404).json({ message: "Stock level not found" });
//     }

//     // Update the stock level with the new information
//     stockLevel.currentQuantity =
//       req.body.currentQuantity || stockLevel.currentQuantity;
//     stockLevel.minimumQuantity =
//       req.body.minimumQuantity || stockLevel.minimumQuantity;
//     stockLevel.maximumQuantity =
//       req.body.maximumQuantity || stockLevel.maximumQuantity;

//     await stockLevel.save();
//     res.json(stockLevel);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete a stock level
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const stockLevel = await StockLevel.findOne({ _id: req.params.id });
//     if (!stockLevel) {
//       return res.status(404).json({ message: "Stock level not found" });
//     }

//     await stockLevel.deleteOne();
//     res.json({ message: "Stock level deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

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
