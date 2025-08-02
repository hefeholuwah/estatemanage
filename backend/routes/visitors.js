const express = require('express');
const {
  registerVisitor,
  getVisitors,
  getVisitor,
  verifyAccessCode
} = require('../controllers/visitors');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, registerVisitor)
  .get(protect, getVisitors);

router.route('/:id')
  .get(protect, getVisitor);

router.post('/verify', protect, authorize('security'), verifyAccessCode);

module.exports = router; 