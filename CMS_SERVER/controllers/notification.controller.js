const db = require("../models");
const Notification = db.Notification;

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
      status: status || "active",
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
    const updateData = { categoryTypeId, status, title };

    if (req.file) {
      updateData.pdfPath = req.file.path;
    }

    const [updated] = await Notification.update(updateData, { where: { id: req.params.id } });

    if (updated) {
      const updatedNotification = await Notification.findByPk(req.params.id);
      return res.json(updatedNotification);
    } else {
      return res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update notification", error: error.message });
  }
};


// Delete Notification by id
exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification", error });
  }
};
