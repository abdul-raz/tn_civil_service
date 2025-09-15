const express = require("express");
const router = express.Router();
const masterDataController = require("../controllers/masterData.controller");

router.get("/examTypes", masterDataController.getExamTypes);
router.get("/years", masterDataController.getYears);
router.get("/processDocumentTypes", masterDataController.getProcessDocumentTypes);
router.get("/galleryCategories", masterDataController.getGalleryCategories);
router.get("/notificationTypes", masterDataController.getNotificationTypes);
router.get("/videoCategories", masterDataController.getVideoCategories);

module.exports = router;
