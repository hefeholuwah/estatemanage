const express = require('express');
const {
  createEmergencyAlert,
  getEmergencyAlerts,
  getMyEmergencyAlerts,
  updateEmergencyAlert,
  addEmergencyNote
} = require('../controllers/emergency');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createEmergencyAlert)
  .get(protect, authorize('security'), getEmergencyAlerts);

router.get('/my-alerts', protect, getMyEmergencyAlerts);

router.route('/:id')
  .put(protect, authorize('security'), updateEmergencyAlert);

router.post('/:id/notes', protect, authorize('security'), addEmergencyNote);

module.exports = router; 