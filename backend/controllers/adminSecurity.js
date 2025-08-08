const User = require('../models/User');
const Estate = require('../models/Estate');
const bcrypt = require('bcryptjs');

// @desc    Get all security personnel
// @route   GET /api/admin/security
// @access  Private
const getAllSecurity = async (req, res) => {
  try {
    const admin = req.admin;
    
    // Get estates managed by this admin
    let estatesQuery = {};
    if (admin.role !== 'super_admin') {
      const estates = await Estate.find({ createdBy: admin._id });
      const estateIds = estates.map(estate => estate._id);
      estatesQuery = { estate: { $in: estateIds } };
    }
    
    // Get security personnel (users with role 'security')
    const security = await User.find({
      ...estatesQuery,
      role: 'security'
    })
      .populate('estate', 'name')
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: security.length,
      data: security
    });
  } catch (error) {
    console.error('Get security error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single security personnel
// @route   GET /api/admin/security/:id
// @access  Private
const getSecurityById = async (req, res) => {
  try {
    const security = await User.findById(req.params.id)
      .populate('estate', 'name address')
      .select('-password');
    
    if (!security) {
      return res.status(404).json({
        success: false,
        error: 'Security personnel not found'
      });
    }
    
    if (security.role !== 'security') {
      return res.status(400).json({
        success: false,
        error: 'User is not security personnel'
      });
    }
    
    res.status(200).json({
      success: true,
      data: security
    });
  } catch (error) {
    console.error('Get security error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new security personnel
// @route   POST /api/admin/security
// @access  Private
const createSecurity = async (req, res) => {
  try {
    const { name, userId, password, apartment, estate, shift, accessLevel } = req.body;
    
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
        error: 'Not authorized to create security personnel for this estate'
      });
    }
    
    const security = await User.create({
      name,
      userId,
      password,
      apartment,
      estate,
      role: 'security',
      shift: shift || 'day',
      accessLevel: accessLevel || 'basic'
    });
    
    // Remove password from response
    const securityResponse = security.toObject();
    delete securityResponse.password;
    
    res.status(201).json({
      success: true,
      data: securityResponse
    });
  } catch (error) {
    console.error('Create security error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update security personnel
// @route   PUT /api/admin/security/:id
// @access  Private
const updateSecurity = async (req, res) => {
  try {
    const security = await User.findById(req.params.id);
    
    if (!security) {
      return res.status(404).json({
        success: false,
        error: 'Security personnel not found'
      });
    }
    
    if (security.role !== 'security') {
      return res.status(400).json({
        success: false,
        error: 'User is not security personnel'
      });
    }
    
    // Check if admin has access to this security's estate
    const admin = req.admin;
    if (admin.role !== 'super_admin') {
      const estate = await Estate.findById(security.estate);
      if (!estate || estate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this security personnel'
        });
      }
    }
    
    // If password is being updated, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    
    const updatedSecurity = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: updatedSecurity
    });
  } catch (error) {
    console.error('Update security error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete security personnel
// @route   DELETE /api/admin/security/:id
// @access  Private
const deleteSecurity = async (req, res) => {
  try {
    const security = await User.findById(req.params.id);
    
    if (!security) {
      return res.status(404).json({
        success: false,
        error: 'Security personnel not found'
      });
    }
    
    if (security.role !== 'security') {
      return res.status(400).json({
        success: false,
        error: 'User is not security personnel'
      });
    }
    
    // Check if admin has access to this security's estate
    const admin = req.admin;
    if (admin.role !== 'super_admin') {
      const estate = await Estate.findById(security.estate);
      if (!estate || estate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this security personnel'
        });
      }
    }
    
    await security.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete security error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get security by estate
// @route   GET /api/admin/estates/:estateId/security
// @access  Private
const getSecurityByEstate = async (req, res) => {
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
    
    const security = await User.find({ 
      estate: estateId, 
      role: 'security' 
    })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: security.length,
      data: security
    });
  } catch (error) {
    console.error('Get security by estate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Assign security to estate
// @route   POST /api/admin/security/:securityId/assign-estate
// @access  Private
const assignSecurityToEstate = async (req, res) => {
  try {
    const { estateId } = req.body;
    const securityId = req.params.securityId;
    
    // Check if security personnel exists
    const security = await User.findById(securityId);
    if (!security) {
      return res.status(404).json({
        success: false,
        error: 'Security personnel not found'
      });
    }
    
    if (security.role !== 'security') {
      return res.status(400).json({
        success: false,
        error: 'User is not security personnel'
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
    
    // Check if admin has access to both security's current estate and target estate
    const admin = req.admin;
    if (admin.role !== 'super_admin') {
      const securityEstate = await Estate.findById(security.estate);
      if (!securityEstate || securityEstate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to manage this security personnel'
        });
      }
      
      if (estate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to assign to this estate'
        });
      }
    }
    
    // Update security's estate
    security.estate = estateId;
    await security.save();
    
    const updatedSecurity = await User.findById(securityId)
      .populate('estate', 'name')
      .select('-password');
    
    res.status(200).json({
      success: true,
      data: updatedSecurity
    });
  } catch (error) {
    console.error('Assign security to estate error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Remove security from estate
// @route   DELETE /api/admin/security/:securityId/estates/:estateId
// @access  Private
const removeSecurityFromEstate = async (req, res) => {
  try {
    const { securityId, estateId } = req.params;
    
    // Check if security personnel exists and is assigned to this estate
    const security = await User.findById(securityId);
    if (!security) {
      return res.status(404).json({
        success: false,
        error: 'Security personnel not found'
      });
    }
    
    if (security.role !== 'security') {
      return res.status(400).json({
        success: false,
        error: 'User is not security personnel'
      });
    }
    
    if (security.estate.toString() !== estateId) {
      return res.status(400).json({
        success: false,
        error: 'Security personnel is not assigned to this estate'
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
    
    // Remove security from estate (delete the user)
    await security.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Remove security from estate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  getAllSecurity,
  getSecurityById,
  createSecurity,
  updateSecurity,
  deleteSecurity,
  getSecurityByEstate,
  assignSecurityToEstate,
  removeSecurityFromEstate
}; 