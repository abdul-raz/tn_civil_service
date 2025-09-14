const express = require("express");
const router = express.Router();
const answerKeyController = require("../controllers/answerKey.controller");
const authController = require("../controllers/auth.controller");

// Public GET route for fetching all answer keys
router.get("/", answerKeyController.getAllAnswerKeys);

// Protected routes (admin only)
router.post("/", authController.isAdmin, answerKeyController.uploadAnswerKeys);
router.delete(
  "/:id",
  authController.isAdmin,
  answerKeyController.deleteAnswerKey
);

module.exports = router;
