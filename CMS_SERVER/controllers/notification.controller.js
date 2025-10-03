const db = require("../models");
const Notification = db.Notification;
const path = require("path");
const fs = require("fs");
exports.createNotification = async (req, res) => {
  try {
    const { title, categoryId, categoryTypeId, status } = req.body;  // Include title here
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }
    const pdfPath = req.file.path;

    // Save title along with other fields in the database
    const notification = await Notification.create({
      title,  // Save title
      pdfPath,
      categoryTypeId,
      status: status || "inactive",
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({
      message: "Failed to create notification",
      error: error.message || error.toString(),
    });
  }
};



// Get all Notifications with related NotificationType
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: [{ model: db.NotificationType, as: "categoryType" }],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to get notifications", error });
  }
};

// Get single Notification by id
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id, {
      include: [{ model: db.NotificationType, as: "categoryType" }],
    });
    if (notification) {
      res.status(200).json(notification);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to get notification", error });
  }
};

// Update Notification with optional file upload
exports.updateNotification = async (req, res) => {
  try {
    const { categoryTypeId, status, title } = req.body;

    // Find existing notification
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const updateData = { categoryTypeId, status, title };

    if (req.file) {
      // Delete old file if exists
      if (notification.pdfPath) {
        const oldFilePath = path.resolve(notification.pdfPath);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
            console.log(`Deleted old file at: ${oldFilePath}`);
          } catch (err) {
            console.error(`Failed to delete old file at ${oldFilePath}`, err);
            return res.status(500).json({ message: "Failed to delete old file" });
          }
        }
      }
      // Set new file path
      updateData.pdfPath = req.file.path.replace(/\\/g, '/');
    }

    // Update notification record
    await notification.update(updateData);

    return res.json(notification);

  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({ message: "Failed to update notification", error: error.message });
  }
};


// Delete Notification by id
exports.deleteNotification = async (req, res) => {
  try {
    const id = req.params.id;

    // Find notification first to get pdfPath
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Delete the PDF file if exists
    if (notification.pdfPath) {
      const filePath = path.resolve(notification.pdfPath);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted file at: ${filePath}`);
        } catch (fsErr) {
          console.error(`Failed to delete file at ${filePath}`, fsErr);
          // Optionally return error here or continue deletion of DB record
          return res.status(500).json({ message: "Failed to delete associated file" });
        }
      }
    }

    // Delete the notification record from DB
    await notification.destroy();

    res.status(204).json(); // No Content on successful delete
  } catch (error) {
    console.error("Failed to delete notification:", error);
    res.status(500).json({ message: "Failed to delete notification", error });
  }
};
