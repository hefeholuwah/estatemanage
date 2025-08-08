const express = require('express');
const {
  adminLogin,
  getMe,
  updateProfile,
  changePassword,
  createAdmin,
  getAllAdmins
} = require('../controllers/adminAuth');

const { protect, authorize, superAdmin } = require('../middleware/adminAuth');

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes
router.use(protect);

// Admin profile routes
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Super admin only routes
router.post('/create', authorize('super_admin'), createAdmin);
router.get('/all', authorize('super_admin'), getAllAdmins);

module.exports = router; 