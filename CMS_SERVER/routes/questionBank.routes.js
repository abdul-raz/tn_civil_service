const express = require("express");
const router = express.Router();
const questionBankController = require("../controllers/questionBank.controller");
const authController = require("../controllers/auth.controller");

// Public GET routes
router.get("/", questionBankController.getAllQuestionBanks);
router.get("/:id", questionBankController.getQuestionBankById);

// Protected routes (admin only)
router.post(
  "/",
  authController.isAdmin,
  questionBankController.addQuestionBank
);
router.put(
  "/:id",
  authController.isAdmin,
  questionBankController.updateQuestionBank
);
router.delete(
  "/:id",
  authController.isAdmin,
  questionBankController.deleteQuestionBank
);

module.exports = router;
