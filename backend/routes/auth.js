const express = require('express');
const {
  register,
  login,
  getMe,
  createUser,
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Admin routes
router.post('/create-user', protect, authorize('security'), createUser);
router.get('/users', protect, authorize('security'), getUsers);
router.put('/users/:id', protect, authorize('security'), updateUser);
router.delete('/users/:id', protect, authorize('security'), deleteUser);

module.exports = router; 