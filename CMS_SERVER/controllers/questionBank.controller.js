const db = require("../models");
const QuestionBank = db.QuestionBank;
const path = require("path");
const multer = require("multer");

// Storage config - store uploaded pdfs in 'uploads/questionBank/'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/questionBank/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter: allow only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Create Question Bank Entry with PDF upload
exports.addQuestionBank = [
  upload.single("file"), // "file" is the field name in form-data
  async (req, res) => {
    try {
      const { type } = req.body;
      if (!type) {
        return res.status(400).send({ message: "Type is required." });
      }
      if (!req.file) {
        return res
          .status(400)
          .send({ message: "PDF file upload is required." });
      }

      // Use uploaded file info for name and size
      const newEntry = await QuestionBank.create({
        name: req.file.originalname,
        type,
        size: req.file.size.toString(), // file size in bytes as string
        path: req.file.path,
      });

      return res.status(201).send({
        message: "Question Bank created successfully.",
        data: newEntry,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server error." });
    }
  },
];

// Get All Question Bank Entries
exports.getAllQuestionBanks = async (req, res) => {
  try {
    const allEntries = await QuestionBank.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).send(allEntries);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

// Get Single Question Bank Entry by ID
exports.getQuestionBankById = async (req, res) => {
  try {
    const id = req.params.id;
    const entry = await QuestionBank.findByPk(id);
    if (!entry) {
      return res
        .status(404)
        .send({ message: "Question Bank entry not found." });
    }
    return res.status(200).send(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

// Update Question Bank Entry (no file update)
exports.updateQuestionBank = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, type, size } = req.body;

    const entry = await QuestionBank.findByPk(id);
    if (!entry) {
      return res
        .status(404)
        .send({ message: "Question Bank entry not found." });
    }

    await entry.update({ name, type, size });

    return res
      .status(200)
      .send({ message: "Question Bank updated successfully.", data: entry });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

// Delete Question Bank Entry by ID
exports.deleteQuestionBank = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await QuestionBank.destroy({ where: { id } });
    if (!deleted) {
      return res
        .status(404)
        .send({ message: "Question Bank entry not found." });
    }
    return res
      .status(200)
      .send({ message: "Question Bank deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};
