const db = require("../models");
const Result = db.Result;
const fs = require("fs");
const path = require("path");

const validateInput = (data) => {
  const errors = {};
  const typeIdNum = parseInt(data.typeId, 10);

  if (!data.typeId || !Number.isInteger(typeIdNum)) {
    errors.typeId = "Valid typeId is required";
  }
  if (!data.year || !/^\d{4}(-\d{4})?$/.test(data.year)) {
    errors.year = "Year must be a 4-digit year or a range like '2018-2019'";
  }
  if (data.status === undefined || ![0,1].includes(Number(data.status))) {
    errors.status = "Status must be 0 (inactive) or 1 (active)";
  }
  return errors;
};

exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.findAll({ order: [["year", "DESC"]] });
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Server error fetching results" });
  }
};

exports.getResultById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Result.findByPk(id);
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching result:", err);
    res.status(500).json({ message: "Server error fetching result" });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, typeId, year, status } = req.body;

    console.log("Incoming create request data:", { title, typeId, year, status });
    console.log("Received file info:", req.file);

    // Validation
    const errors = {};
    if (!title) errors.title = "Title is required";
    if (!typeId) errors.typeId = "typeId is required";
    if (!year) errors.year = "year is required";
    if (status === undefined) errors.status = "status is required";
    if (!req.file) errors.file = "PDF file is required";

    if (Object.keys(errors).length) {
      console.log("Validation errors:", errors);
      return res.status(400).json({ errors });
    }

    const validatedErrors = validateInput({ typeId, year, status });
    if (Object.keys(validatedErrors).length) {
      return res.status(400).json({ errors: validatedErrors });
    }

    const pdfPath = req.file.path.replace(/\\/g, '/');
    console.log("Normalized PDF path for DB:", pdfPath);

    const createData = {
      title,
      typeId: parseInt(typeId, 10),
      year,
      status: Number(status),
      pdfPath,
    };
    console.log("Data to create:", createData);

    const newResult = await Result.create(createData);
    console.log("Created Result:", newResult.toJSON());

    return res.status(201).json({ message: "Result created", data: newResult });
  } catch (error) {
    console.error("Error during create operation:", error);

    if (error.name === "SequelizeValidationError") {
      error.errors.forEach(errItem => {
        console.error(`Validation error on ${errItem.path}: ${errItem.message}`);
      });
    }

    return res.status(500).json({ message: "Server error creating result" });
  }
};

exports.updateResult = async (req, res) => {
  try {
    const id = req.params.id;
    const { typeId, year, title, status } = req.body;

    const result = await Result.findByPk(id);
    if (!result) return res.status(404).json({ message: "Result not found" });

    // Validate inputs
    const errors = validateInput({ typeId, year, status });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const updateData = {
      typeId: parseInt(typeId, 10),
      year,
      title,
      status: Number(status),
    };

    if (req.file) {
      // Delete old PDF if exists
      if (result.pdfPath && fs.existsSync(result.pdfPath)) {
        fs.unlinkSync(result.pdfPath);
      }
      updateData.pdfPath = req.file.path.replace(/\\/g, '/');
    }

    await result.update(updateData);
    res.status(200).json({ message: "Result updated", data: result });
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ message: "Server error updating result" });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Result.findByPk(id);
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Delete stored file if exists
    if (result.pdfPath) {
      const filePath = path.resolve(result.pdfPath);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted file at: ${filePath}`);
        } catch (fsErr) {
          console.error(`Failed to delete file at ${filePath}`, fsErr);
          return res.status(500).json({ message: "Failed to delete associated file" });
        }
      }
    }

    // Delete database record after file deletion
    await result.destroy();
    res.status(200).json({ message: "Result deleted" });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ message: "Server error deleting result" });
  }
};
