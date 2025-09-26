const express = require('express');
const router = express.Router();
const {
  getGalleryCount,
  getQuestionBankCount,
  getResultCount,
  getNotificationCount,
} = require('../controllers/dashboard.controller');

router.get('/gallery-count', getGalleryCount);

router.get('/questionbank-count', getQuestionBankCount);

router.get('/result-count', getResultCount);

router.get('/notification-count', getNotificationCount);

module.exports = router;
