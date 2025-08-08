const Visitor = require('../models/Visitor');
const User = require('../models/User');
const Estate = require('../models/Estate');
const AccessLog = require('../models/AccessLog');

// @desc    Get all visitors
// @route   GET /api/admin/visitors
// @access  Private
const getAllVisitors = async (req, res) => {
  try {
    const admin = req.admin;
    
    // Get estates managed by this admin
    let estatesQuery = {};
    if (admin.role !== 'super_admin') {
      const estates = await Estate.find({ createdBy: admin._id });
      const estateIds = estates.map(estate => estate._id);
      estatesQuery = { estate: { $in: estateIds } };
    }
    
    const visitors = await Visitor.find(estatesQuery)
      .populate('resident', 'name userId apartment')
      .populate('estate', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors
    });
  } catch (error) {
    console.error('Get visitors error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single visitor
// @route   GET /api/admin/visitors/:id
// @access  Private
const getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate('resident', 'name userId apartment')
      .populate('estate', 'name address');
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: 'Visitor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: visitor
    });
  } catch (error) {
    console.error('Get visitor error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update visitor
// @route   PUT /api/admin/visitors/:id
// @access  Private
const updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: 'Visitor not found'
      });
    }
    
    // Check if admin has access to this visitor's estate
    const admin = req.admin;
    if (admin.role !== 'super_admin') {
      const estate = await Estate.findById(visitor.estate);
      if (!estate || estate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this visitor'
        });
      }
    }
    
    const updatedVisitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('resident', 'name userId apartment')
     .populate('estate', 'name');
    
    res.status(200).json({
      success: true,
      data: updatedVisitor
    });
  } catch (error) {
    console.error('Update visitor error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete visitor
// @route   DELETE /api/admin/visitors/:id
// @access  Private
const deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: 'Visitor not found'
      });
    }
    
    // Check if admin has access to this visitor's estate
    const admin = req.admin;
    if (admin.role !== 'super_admin') {
      const estate = await Estate.findById(visitor.estate);
      if (!estate || estate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this visitor'
        });
      }
    }
    
    await visitor.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete visitor error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get visitors by estate
// @route   GET /api/admin/estates/:estateId/visitors
// @access  Private
const getVisitorsByEstate = async (req, res) => {
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
    
    const visitors = await Visitor.find({ estate: estateId })
      .populate('resident', 'name userId apartment')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors
    });
  } catch (error) {
    console.error('Get visitors by estate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get visitor logs
// @route   GET /api/admin/visitors/logs
// @access  Private
const getVisitorLogs = async (req, res) => {
  try {
    const admin = req.admin;
    
    // Get estates managed by this admin
    let estatesQuery = {};
    if (admin.role !== 'super_admin') {
      const estates = await Estate.find({ createdBy: admin._id });
      const estateIds = estates.map(estate => estate._id);
      estatesQuery = { estate: { $in: estateIds } };
    }
    
    const logs = await AccessLog.find(estatesQuery)
      .populate('visitor', 'name accessCode')
      .populate('resident', 'name userId apartment')
      .populate('securityOfficer', 'name userId')
      .populate('estate', 'name')
      .sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Get visitor logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  getAllVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
  getVisitorsByEstate,
  getVisitorLogs
}; 