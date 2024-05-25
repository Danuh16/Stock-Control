const express = require("express");
const router = express.Router();
const { userAuth, checkRole } = require("../middlewares/auth");

// Stock Control Registration Route
router.post("/register-stockControl", async (req, res) => {
  await userController.userSignup(req.body, "stockControl", res);
});

// Admin Registration route
router.post("/register-admin", async (req, res) => {
  await userController.userSignup(req.body, "admin", res);
});

// Stock Control Login Route
router.post("/Login-stockControl", async (req, res) => {
  await userController.userLogin(req.body, "stockControl", res);
});

// Admin Login Route
router.post("/Login-admin", async (req, res) => {
  await userController.userLogin(req.body, "admin", res);
});

router.get(
  "/stockControl-protected",
  userAuth,
  checkRole(["stockControl"]),
  async (req, res) => {
    return res.json(`welcome ${req.user.fullName}`);
  }
);

router.get(
  "/admin-protected",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json(`welcome ${req.user.fullName}`);
  }
);

module.exports = router;