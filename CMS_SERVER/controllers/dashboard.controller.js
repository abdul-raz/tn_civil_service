const { Gallery, QuestionBank, Result, Notification } = require('../models');

exports.getGalleryCount = async (req, res) => {
  try {
    const total = await Gallery.count();
    const active = await Gallery.count({ where: { status: 'Active' } });
    res.json({ total, active });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getQuestionBankCount = async (req, res) => {
  try {
    const total = await QuestionBank.count();
    const active = await QuestionBank.count({ where: { status: 'Active' } });
    res.json({ total, active });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getResultCount = async (req, res) => {
  try {
    const total = await Result.count();
    const active = await Result.count({ where: { status: 1 } });
    res.json({ total, active });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getNotificationCount = async (req, res) => {
  try {
    const total = await Notification.count();
    const active = await Notification.count({ where: { status: 'active' } });
    res.json({ total, active });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
