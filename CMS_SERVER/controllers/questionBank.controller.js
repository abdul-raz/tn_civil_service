
const db = require("../models");
const QuestionBank = db.QuestionBank;
const path = require("path");
const multer = require("multer");

// Storage config per file type
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "questionPaper") {
      cb(null, "uploads/questionBank/");
    } else if (file.fieldname === "answerKey") {
      cb(null, "uploads/answerKey/");
    } else if (file.fieldname === "keyExplanation") {
      cb(null, "uploads/keyExplanation/");
    } else {
      cb(new Error("Invalid file field"), false);
    }
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

// ============ CONTROLLERS ============

// Create Question Bank Entry
exports.addQuestionBank = [
  upload.fields([
    { name: "questionPaper", maxCount: 1 },
    { name: "answerKey", maxCount: 1 },
    { name: "keyExplanation", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { type, year } = req.body;

      if (!type) return res.status(400).json({ message: "Type is required." });
      if (!year) return res.status(400).json({ message: "Year is required." });
      if (!req.files["questionPaper"]) {
        return res.status(400).json({ message: "Question paper file is required." });
      }
      if (!req.files["answerKey"]) {
        return res.status(400).json({ message: "Answer key file is required." });
      }

      const questionPaperFile = req.files["questionPaper"][0];
      const answerKeyFile = req.files["answerKey"][0];
      const keyExplanationFile = req.files["keyExplanation"]
        ? req.files["keyExplanation"][0]
        : null;

      const newEntry = await QuestionBank.create({
        name: questionPaperFile.originalname,
        type,
        year,
        questionPaperPath: questionPaperFile.path,
        questionPaperSize: questionPaperFile.size.toString(),
        answerKeyPath: answerKeyFile.path,
        answerKeySize: answerKeyFile.size.toString(),
        keyExplanationPath: keyExplanationFile ? keyExplanationFile.path : null,
        keyExplanationSize: keyExplanationFile ? keyExplanationFile.size.toString() : null,
      });

      return res.status(201).json({
        message: "Question Bank created successfully.",
        data: newEntry,
      });
    } catch (error) {
      console.error("Error in addQuestionBank:", error);
      return res.status(500).json({ message: "Server error." });
    }
  },
];

// Get All
exports.getAllQuestionBanks = async (req, res) => {
  try {
    const allEntries = await QuestionBank.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).send(allEntries);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

// Get One
exports.getQuestionBankById = async (req, res) => {
  try {
    const entry = await QuestionBank.findByPk(req.params.id);
    if (!entry) return res.status(404).send({ message: "Question Bank entry not found." });
    return res.status(200).send(entry);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

// Update Question Bank Entry with file support
exports.updateQuestionBank = [
  upload.fields([
    { name: "questionPaper", maxCount: 1 },
    { name: "answerKey", maxCount: 1 },
    { name: "keyExplanation", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const { name, type, status, year } = req.body;

      const entry = await QuestionBank.findByPk(id);
      if (!entry) {
        return res.status(404).send({ message: "Question Bank entry not found." });
      }

      const updateData = { name, type, status, year };

      if (req.files["questionPaper"]) {
        const file = req.files["questionPaper"][0];
        updateData.questionPaperPath = file.path;
        updateData.questionPaperSize = file.size.toString();
      }

      if (req.files["answerKey"]) {
        const file = req.files["answerKey"][0];
        updateData.answerKeyPath = file.path;
        updateData.answerKeySize = file.size.toString();
      }

      if (req.files["keyExplanation"]) {
        const file = req.files["keyExplanation"][0];
        updateData.keyExplanationPath = file.path;
        updateData.keyExplanationSize = file.size.toString();
      }

      await entry.update(updateData);

      return res.status(200).send({
        message: "Question Bank updated successfully.",
        data: entry,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server error." });
    }
  },
];

// Delete
exports.deleteQuestionBank = async (req, res) => {
  try {
    const deleted = await QuestionBank.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).send({ message: "Question Bank entry not found." });
    }
    return res.status(200).send({ message: "Question Bank deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error." });
  }
};

// const db = require("../models");
// const QuestionBank = db.QuestionBank;
// const path = require("path");
// const multer = require("multer");

// // Storage config - store uploaded pdfs in 'uploads/questionBank/'
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/questionBank/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// // File filter: allow only PDFs
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "application/pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF files allowed!"), false);
//   }
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });

// // Create Question Bank Entry with PDF upload
// exports.addQuestionBank = [
//   upload.single("file"), // "file" is the field name in form-data
//   async (req, res) => {
//     try {
//       const { type, year } = req.body;

//       if (!type) {
//         return res.status(400).json({ message: "Type is required." });
//       }
//       if (!year) {
//         return res.status(400).json({ message: "Year is required." });
//       }
//       if (!req.file) {
//         return res.status(400).json({ message: "PDF file upload is required." });
//       }

//       // Create entry in DB
//       const newEntry = await QuestionBank.create({
//         name: req.file.originalname,
//         type,
//         year,
//         size: req.file.size.toString(), // size in bytes as string
//         path: req.file.path, // or req.file.filename if you’re saving only file name
//       });

//       return res.status(201).json({
//         message: "Question Bank created successfully.",
//         data: newEntry,
//       });
//     } catch (error) {
//       console.error("Error in addQuestionBank:", error);
//       return res.status(500).json({ message: "Server error." });
//     }
//   },
// ];


// // Get All Question Bank Entries
// exports.getAllQuestionBanks = async (req, res) => {
//   try {
//     const allEntries = await QuestionBank.findAll({
//       order: [["createdAt", "DESC"]],
//     });
//     return res.status(200).send(allEntries);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ message: "Server error." });
//   }
// };

// // Get Single Question Bank Entry by ID
// exports.getQuestionBankById = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const entry = await QuestionBank.findByPk(id);
//     if (!entry) {
//       return res
//         .status(404)
//         .send({ message: "Question Bank entry not found." });
//     }
//     return res.status(200).send(entry);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ message: "Server error." });
//   }
// };

// // Update Question Bank Entry (no file update)
// exports.updateQuestionBank = async (req, res) => {
//   try {
//     const id = req.params.id;
//     // const { name, type, size } = req.body;
//     const { name, type, status,year } = req.body;


//     const entry = await QuestionBank.findByPk(id);
//     if (!entry) {
//       return res
//         .status(404)
//         .send({ message: "Question Bank entry not found." });
//     }

//     await entry.update({ name, type, status,year });

//     return res
//       .status(200)
//       .send({ message: "Question Bank updated successfully.", data: entry });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ message: "Server error." });
//   }
// };

// // Delete Question Bank Entry by ID
// exports.deleteQuestionBank = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const deleted = await QuestionBank.destroy({ where: { id } });
//     if (!deleted) {
//       return res
//         .status(404)
//         .send({ message: "Question Bank entry not found." });
//     }
//     return res
//       .status(200)
//       .send({ message: "Question Bank deleted successfully." });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ message: "Server error." });
//   }
// };
