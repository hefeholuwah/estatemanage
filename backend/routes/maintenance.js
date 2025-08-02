const express = require('express');
const {
  createMaintenanceRequest,
  getMaintenanceRequests,
  getMyMaintenanceRequests,
  updateMaintenanceRequest,
  addMaintenanceNote
} = require('../controllers/maintenance');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createMaintenanceRequest)
  .get(protect, authorize('maintenance', 'security'), getMaintenanceRequests);

router.get('/my-requests', protect, getMyMaintenanceRequests);

router.route('/:id')
  .put(protect, authorize('maintenance', 'security'), updateMaintenanceRequest);

router.post('/:id/notes', protect, addMaintenanceNote);

module.exports = router; 