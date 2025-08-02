const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} = require('../controllers/notifications');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getNotifications);

router.get('/unread-count', protect, getUnreadCount);

router.put('/mark-all-read', protect, markAllAsRead);

router.route('/:id')
  .put(protect, markAsRead)
  .delete(protect, deleteNotification);

module.exports = router; 