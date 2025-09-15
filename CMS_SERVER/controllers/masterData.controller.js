const db = require("../models");

exports.getExamTypes = async (req, res) => {
  try {
    const examTypes = await db.ExamType.findAll({ order: [["name", "ASC"]] });
    res.status(200).json(examTypes);
  } catch (error) {
    console.error("Error fetching ExamTypes:", error);
    res.status(500).json({ message: "Server error fetching ExamTypes" });
  }
};

exports.getYears = async (req, res) => {
  try {
    const years = await db.Year.findAll({ order: [["name", "ASC"]] });
    res.status(200).json(years);
  } catch (error) {
    console.error("Error fetching Years:", error);
    res.status(500).json({ message: "Server error fetching Years" });
  }
};

exports.getProcessDocumentTypes = async (req, res) => {
  try {
    const processDocumentTypes = await db.ProcessDocumentType.findAll({ order: [["name", "ASC"]] });
    res.status(200).json(processDocumentTypes);
  } catch (error) {
    console.error("Error fetching ProcessDocumentTypes:", error);
    res.status(500).json({ message: "Server error fetching ProcessDocumentTypes" });
  }
};

exports.getGalleryCategories = async (req, res) => {
  try {
    const galleryCategories = await db.GalleryCategory.findAll({ order: [["name", "ASC"]] });
    res.status(200).json(galleryCategories);
  } catch (error) {
    console.error("Error fetching GalleryCategories:", error);
    res.status(500).json({ message: "Server error fetching GalleryCategories" });
  }
};

exports.getNotificationTypes = async (req, res) => {
  try {
    const notificationTypes = await db.NotificationType.findAll({ order: [["name", "ASC"]] });
    res.status(200).json(notificationTypes);
  } catch (error) {
    console.error("Error fetching NotificationTypes:", error);
    res.status(500).json({ message: "Server error fetching NotificationTypes" });
  }
};

exports.getVideoCategories = async (req, res) => {
  try {
    const videoCategories = await db.VideoCategory.findAll({ order: [["name", "ASC"]] });
    res.status(200).json(videoCategories);
  } catch (error) {
    console.error("Error fetching VideoCategories:", error);
    res.status(500).json({ message: "Server error fetching VideoCategories" });
  }
};
