const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, userId, password, apartment, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User ID already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      userId,
      password,
      apartment,
      role: role || 'resident'
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Validate email & password
    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a user ID and password'
      });
    }

    // Check for user
    const user = await User.findOne({ userId }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Create user (Admin only)
// @route   POST /api/auth/create-user
// @access  Private (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, userId, password, apartment, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User ID already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      userId,
      password,
      apartment,
      role: role || 'resident'
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        userId: user.userId,
        apartment: user.apartment,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/auth/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { name, apartment, role, password } = req.body;
    const updateData = { name, apartment, role };

    // Only update password if provided
    if (password) {
      updateData.password = password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      userId: user.userId,
      apartment: user.apartment,
      role: user.role,
      profileImage: user.profileImage
    }
  });
}; 