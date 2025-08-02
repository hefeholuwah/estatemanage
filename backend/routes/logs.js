const express = require('express');
const {
  createAccessLog,
  getAccessLogs,
  getResidentLogs
} = require('../controllers/logs');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Standard routes
router.route('/')
  .get(protect, authorize('security'), getAccessLogs);

// Create log route
router.post('/create', protect, authorize('security'), createAccessLog);

// Resident logs route
router.get('/resident', protect, getResidentLogs);

module.exports = router; 