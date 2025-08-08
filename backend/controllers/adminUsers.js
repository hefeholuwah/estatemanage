const User = require('../models/User');
const Estate = require('../models/Estate');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    const admin = req.admin;
    
    // Get estates managed by this admin
    let estatesQuery = {};
    if (admin.role !== 'super_admin') {
      const estates = await Estate.find({ createdBy: admin._id });
      const estateIds = estates.map(estate => estate._id);
      estatesQuery = { estate: { $in: estateIds } };
    }
    
    const users = await User.find(estatesQuery)
      .populate('estate', 'name')
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('estate', 'name address')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private
const createUser = async (req, res) => {
  try {
    const { name, userId, password, apartment, estate, role } = req.body;
    
    // Check if user ID already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User ID already exists'
      });
    }
    
    // Check if estate exists and admin has access
    const estateDoc = await Estate.findById(estate);
    if (!estateDoc) {
      return res.status(400).json({
        success: false,
        error: 'Estate not found'
      });
    }
    
    // Check if admin has access to this estate
    const admin = req.admin;
    if (admin.role !== 'super_admin' && estateDoc.createdBy.toString() !== admin._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create users for this estate'
      });
    }
    
    const user = await User.create({
      name,
      userId,
      password,
      apartment,
      estate,
      role: role || 'resident'
    });
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if admin has access to this user's estate
    const admin = req.admin;
    if (admin.role !== 'super_admin') {
      const estate = await Estate.findById(user.estate);
      if (!estate || estate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this user'
        });
      }
    }
    
    // If password is being updated, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if admin has access to this user's estate
    const admin = req.admin;
    if (admin.role !== 'super_admin') {
      const estate = await Estate.findById(user.estate);
      if (!estate || estate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this user'
        });
      }
    }
    
    await user.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get users by estate
// @route   GET /api/admin/estates/:estateId/users
// @access  Private
const getUsersByEstate = async (req, res) => {
  try {
    const estateId = req.params.estateId;
    
    // Check if estate exists and admin has access
    const estate = await Estate.findById(estateId);
    if (!estate) {
      return res.status(404).json({
        success: false,
        error: 'Estate not found'
      });
    }
    
    const admin = req.admin;
    if (admin.role !== 'super_admin' && estate.createdBy.toString() !== admin._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this estate'
      });
    }
    
    const users = await User.find({ estate: estateId })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users by estate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Assign user to estate
// @route   POST /api/admin/users/:userId/assign-estate
// @access  Private
const assignUserToEstate = async (req, res) => {
  try {
    const { estateId } = req.body;
    const userId = req.params.userId;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if estate exists
    const estate = await Estate.findById(estateId);
    if (!estate) {
      return res.status(404).json({
        success: false,
        error: 'Estate not found'
      });
    }
    
    // Check if admin has access to both user's current estate and target estate
    const admin = req.admin;
    if (admin.role !== 'super_admin') {
      const userEstate = await Estate.findById(user.estate);
      if (!userEstate || userEstate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to manage this user'
        });
      }
      
      if (estate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to assign to this estate'
        });
      }
    }
    
    // Update user's estate
    user.estate = estateId;
    await user.save();
    
    const updatedUser = await User.findById(userId)
      .populate('estate', 'name')
      .select('-password');
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Assign user to estate error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Remove user from estate
// @route   DELETE /api/admin/users/:userId/estates/:estateId
// @access  Private
const removeUserFromEstate = async (req, res) => {
  try {
    const { userId, estateId } = req.params;
    
    // Check if user exists and is assigned to this estate
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (user.estate.toString() !== estateId) {
      return res.status(400).json({
        success: false,
        error: 'User is not assigned to this estate'
      });
    }
    
    // Check if admin has access to this estate
    const admin = req.admin;
    if (admin.role !== 'super_admin') {
      const estate = await Estate.findById(estateId);
      if (!estate || estate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to manage this estate'
        });
      }
    }
    
    // Remove user from estate (set to null or delete user)
    // For now, we'll delete the user
    await user.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Remove user from estate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByEstate,
  assignUserToEstate,
  removeUserFromEstate
}; 