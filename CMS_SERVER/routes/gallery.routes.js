const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/gallery.controller");
const authController = require("../controllers/auth.controller");

// Public routes - anyone can fetch galleries
router.get("/", galleryController.getAllGalleries);
router.get("/:id", galleryController.getGalleryById);

// Protected routes - only admin can create, update, delete
router.post("/", authController.isAdmin, galleryController.addGallery);
router.put("/:id", authController.isAdmin, galleryController.updateGallery);
router.delete("/:id", authController.isAdmin, galleryController.deleteGallery);

module.exports = router;
