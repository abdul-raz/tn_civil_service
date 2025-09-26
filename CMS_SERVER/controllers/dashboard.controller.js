const { Gallery, QuestionBank, Result, Notification } = require('../models');

exports.getGalleryCount = async (req, res) => {
  try {
    const count = await Gallery.count({ where: { status: 'Active' } });
    res.json({ activeImageCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getQuestionBankCount = async (req, res) => {
  try {
    const count = await QuestionBank.count({ where: { status: 'Active' } });
    res.json({ activeQuestionBankCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getResultCount = async (req, res) => {
  try {
    const count = await Result.count({ where: { status: 1 } });
    res.json({ activeResultCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getNotificationCount = async (req, res) => {
  try {
    const count = await Notification.count({ where: { status: 'active' } });
    res.json({ activeNotificationCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
