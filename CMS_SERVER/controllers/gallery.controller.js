const path = require("path");
const multer = require("multer");
const fs = require("fs");

const db = require("../models");
const Gallery = db.Gallery;

// Max file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Multer config - memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only jpg, jpeg, and png images are allowed!"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: MAX_FILE_SIZE },
});

// POST: Create gallery without resizing (save file directly)
exports.addGallery = [
  upload.single("image"), // 'image' is form-data field name

  async (req, res) => {
    if (!req.file) {
      return res.status(400).send({ message: "Image file is required and must be under 2MB." });
    }

    try {
      const { title, description, categoryId } = req.body;

      if (!title || !categoryId) {
        return res.status(400).send({ message: "Title and categoryId are required." });
      }

      // Save file buffer directly to disk
      const filename = Date.now() + "-" + req.file.originalname;
      const savePath = path.join("uploads/gallery", filename);
      fs.writeFileSync(savePath, req.file.buffer);

      const stats = fs.statSync(savePath);
      const fileSizeInBytes = stats.size;

      // Create gallery record in DB
      const galleryEntry = await Gallery.create({
        title,
        description,
        imageUrl: savePath,
        categoryId,
        size: fileSizeInBytes.toString(),
      });

      res.status(201).send({
        message: "Gallery entry created successfully.",
        data: galleryEntry,
      });
    } catch (error) {
      console.error("Error in addGallery:", error.message);
      res.status(500).send({ message: "Server error." });
    }
  },
];

// GET all galleries with category
exports.getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.findAll({
      include: [{ association: "category" }],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    res.status(500).send({ message: "Server error." });
  }
};

// GET gallery by ID with category
exports.getGalleryById = async (req, res) => {
  try {
    const id = req.params.id;
    const gallery = await Gallery.findByPk(id, {
      include: [{ association: "category" }],
    });
    if (!gallery) {
      return res.status(404).send({ message: "Gallery entry not found." });
    }
    res.status(200).send(gallery);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).send({ message: "Server error." });
  }
};

// PUT update gallery (no image update)
exports.updateGallery = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, categoryId ,status} = req.body;

    const gallery = await Gallery.findByPk(id);
    if (!gallery) {
      return res.status(404).send({ message: "Gallery entry not found." });
    }

    await gallery.update({ title, description, categoryId ,status});

    res.status(200).send({ message: "Gallery updated successfully.", data: gallery });
  } catch (error) {
    console.error("Error updating gallery:", error);
    res.status(500).send({ message: "Server error." });
  }
};

// DELETE gallery entry and remove file
exports.deleteGallery = async (req, res) => {
  try {
    const id = req.params.id;
    const gallery = await Gallery.findByPk(id);
    if (!gallery) {
      return res.status(404).send({ message: "Gallery entry not found." });
    }

    if (gallery.imageUrl && fs.existsSync(gallery.imageUrl)) {
      fs.unlinkSync(gallery.imageUrl);
    }

    await gallery.destroy();

    res.status(200).send({ message: "Gallery entry deleted successfully." });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    res.status(500).send({ message: "Server error." });
  }
};
