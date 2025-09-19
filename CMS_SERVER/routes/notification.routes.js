const express = require("express");
const multer = require("multer");
const notificationController = require("../controllers/notification.controller");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/notifications"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });
router.post("/", upload.single("file"), notificationController.createNotification);
router.get("/", notificationController.getAllNotifications);
router.get("/:id", notificationController.getNotificationById);
router.put('/:id', upload.single('file'), notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
