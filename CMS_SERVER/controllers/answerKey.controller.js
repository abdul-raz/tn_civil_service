const { body, validationResult, param } = require("express-validator");
const db = require("../models");
const AnswerKey = db.AnswerKey;
const QuestionBank = db.QuestionBank;
const path = require("path");
const multer = require("multer");

// Storage config - uploads stored in 'uploads/answerKey/'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Setting upload destination to 'uploads/answerKey/'");
    cb(null, "uploads/answerKey/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    console.log(
      "Generating filename for upload:",
      uniqueSuffix + path.extname(file.originalname)
    );
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// PDF filter
const fileFilter = (req, file, cb) => {
  console.log("Validating file type:", file.mimetype);
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    console.error("Rejected file because it is not a PDF");
    cb(new Error("Only PDF files allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Middleware array for uploading and validating
exports.uploadAnswerKeys = [
  upload.fields([
    { name: "regularAnswerKey", maxCount: 1 },
    { name: "explanationAnswerKey", maxCount: 1 },
  ]),
  body("questionBankId")
    .notEmpty()
    .withMessage("Question Bank must be selected.")
    .bail()
    .isInt({ gt: 0 })
    .withMessage("Invalid Question Bank ID."),
  async (req, res) => {
    // Validate incoming request body parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("Validation errors:", errors.array());
      // Delete any uploaded files on validation fail to avoid orphan files
      if (req.files) {
        Object.values(req.files).forEach((files) => {
          files.forEach((file) => {
            require("fs").unlink(
              file.path,
              (e) =>
                e &&
                console.error("Failed to delete file on validation error:", e)
            );
          });
        });
      }
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log("Request body:", req.body);
      console.log("Uploaded files:", req.files);

      const { questionBankId } = req.body;

      // Verify question bank exists
      const questionBank = await QuestionBank.findByPk(questionBankId);
      if (!questionBank) {
        console.warn(`Question Bank with id ${questionBankId} not found`);
        return res
          .status(400)
          .send({ message: "Selected Question Bank not found." });
      }
      console.log(
        `Question Bank found: ${questionBank.name} (ID: ${questionBank.id})`
      );

      // Check at least one file uploaded
      if (
        !req.files ||
        (!req.files.regularAnswerKey && !req.files.explanationAnswerKey)
      ) {
        console.warn("No answer key files uploaded");
        return res.status(400).send({
          message:
            "At least one Answer Key file must be uploaded (regular or explanation).",
        });
      }

      const entries = [];

      if (req.files.regularAnswerKey) {
        const file = req.files.regularAnswerKey[0];
        entries.push({
          questionBankId,
          answerKeyType: "REGULAR",
          name: file.originalname,
          path: file.path,
          size: file.size.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log("Prepared regularAnswerKey entry:", file.originalname);
      }

      if (req.files.explanationAnswerKey) {
        const file = req.files.explanationAnswerKey[0];
        entries.push({
          questionBankId,
          answerKeyType: "WITH_EXPLANATION",
          name: file.originalname,
          path: file.path,
          size: file.size.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log("Prepared explanationAnswerKey entry:", file.originalname);
      }

      // Optional: Uncomment to replace existing for question bank
      // await AnswerKey.destroy({ where: { questionBankId } });

      const saved = await AnswerKey.bulkCreate(entries, { returning: true });
      console.log("Answer Keys saved:", saved);

      return res.status(201).send({
        message: "Answer Key(s) uploaded successfully.",
        data: saved,
      });
    } catch (error) {
      console.error("Server error in uploadAnswerKeys:", error);
      return res.status(500).send({ message: "Server error." });
    }
  },
];

// Get all answer keys
exports.getAllAnswerKeys = async (req, res) => {
  try {
    console.log("Fetching all answer keys...");
    const allKeys = await AnswerKey.findAll({
      include: [{ model: QuestionBank, as: "questionBank" }],
      order: [["createdAt", "DESC"]],
    });
    console.log(`Found ${allKeys.length} answer keys.`);
    return res.status(200).send(allKeys);
  } catch (error) {
    console.error("Server error in getAllAnswerKeys:", error);
    return res.status(500).send({ message: "Server error." });
  }
};

// Delete AnswerKey by ID
exports.deleteAnswerKey = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid Answer Key ID"),
  async (req, res) => {
    // Validate param
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("Validation error:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const id = req.params.id;
      console.log(`Attempting to delete AnswerKey ID: ${id}`);

      const deletedCount = await AnswerKey.destroy({ where: { id } });
      if (!deletedCount) {
        console.warn(`AnswerKey ID: ${id} not found for deletion`);
        return res.status(404).send({ message: "Answer Key entry not found." });
      }

      console.log(`AnswerKey ID: ${id} deleted successfully.`);
      return res
        .status(200)
        .send({ message: "Answer Key deleted successfully." });
    } catch (error) {
      console.error("Server error in deleteAnswerKey:", error);
      return res.status(500).send({ message: "Server error." });
    }
  },
];
