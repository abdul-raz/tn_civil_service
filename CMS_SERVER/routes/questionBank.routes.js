const express = require("express");
const router = express.Router();
const questionBankController = require("../controllers/questionBank.controller");

// Create new question bank entry (with PDF upload)
router.post("/", questionBankController.addQuestionBank);

// Get all question bank entries
router.get("/", questionBankController.getAllQuestionBanks);

// Get single question bank entry by ID
router.get("/:id", questionBankController.getQuestionBankById);

// Update question bank entry by ID (does not handle file upload)
router.put("/:id", questionBankController.updateQuestionBank);

// Delete question bank entry by ID
router.delete("/:id", questionBankController.deleteQuestionBank);

module.exports = router;
