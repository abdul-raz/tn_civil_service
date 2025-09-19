const express = require("express");
const router = express.Router();
const resultsController = require("../controllers/results.controller");
const multer = require("multer");
const path = require("path");

// Multer config saving PDFs to uploads/results
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/results");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are allowed"));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // limit 5MB
});

// Routes
router.get("/", resultsController.getAllResults);
router.get("/:id", resultsController.getResultById);
router.post("/", upload.single("file"), resultsController.create);
router.put("/:id", upload.single("file"), resultsController.updateResult);
router.delete("/:id", resultsController.deleteResult);

module.exports = router;
