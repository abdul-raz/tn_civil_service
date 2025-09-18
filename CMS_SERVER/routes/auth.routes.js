const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Create new admin
router.post("/register", authController.createAdmin);

// Admin login
router.post("/login", authController.login);

// Admin logout
router.post("/logout", authController.logout);

// Get current logged-in admin
router.get("/me", authController.getCurrentAdmin);

//Reset Password
router.put("/resetPassword",authController.isAdmin, authController.resetPassword)

module.exports = router;
