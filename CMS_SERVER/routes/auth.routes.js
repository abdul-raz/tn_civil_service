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

//Change Password
router.put("/changePassword",authController.isAdmin, authController.changePassword);

router.post("/createOtp", authController.createOtp);
router.post("/verifyOtp", authController.verifyOtp);
//resetPassword
router.post("/resetPassword",authController.resetPassword);

module.exports = router;
