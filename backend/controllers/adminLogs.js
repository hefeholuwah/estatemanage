const AccessLog = require('../models/AccessLog');
const Estate = require('../models/Estate');
const User = require('../models/User');
const Visitor = require('../models/Visitor');

// @desc    Get all access logs
// @route   GET /api/admin/logs
// @access  Private
const getAllLogs = async (req, res) => {
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
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get logs by estate
// @route   GET /api/admin/estates/:estateId/logs
// @access  Private
const getLogsByEstate = async (req, res) => {
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
    
    const logs = await AccessLog.find({ estate: estateId })
      .populate('visitor', 'name accessCode')
      .populate('resident', 'name userId apartment')
      .populate('securityOfficer', 'name userId')
      .sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Get logs by estate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get logs by user
// @route   GET /api/admin/users/:userId/logs
// @access  Private
const getLogsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check if user exists
    const user = await User.findById(userId);
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
          error: 'Not authorized to access this user'
        });
      }
    }
    
    const logs = await AccessLog.find({
      $or: [
        { resident: userId },
        { securityOfficer: userId }
      ]
    })
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
    console.error('Get logs by user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get logs by security personnel
// @route   GET /api/admin/security/:securityId/logs
// @access  Private
const getLogsBySecurity = async (req, res) => {
  try {
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
    
    // Check if admin has access to this security's estate
    const admin = req.admin;
    if (admin.role !== 'super_admin') {
      const estate = await Estate.findById(security.estate);
      if (!estate || estate.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to access this security personnel'
        });
      }
    }
    
    const logs = await AccessLog.find({ securityOfficer: securityId })
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
    console.error('Get logs by security error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Export logs
// @route   GET /api/admin/logs/export
// @access  Private
const exportLogs = async (req, res) => {
  try {
    const admin = req.admin;
    const { startDate, endDate, estateId, format = 'json' } = req.query;
    
    // Build query
    let query = {};
    
    // Add estate filter
    if (admin.role !== 'super_admin') {
      const estates = await Estate.find({ createdBy: admin._id });
      const estateIds = estates.map(estate => estate._id);
      query.estate = { $in: estateIds };
    } else if (estateId) {
      query.estate = estateId;
    }
    
    // Add date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    const logs = await AccessLog.find(query)
      .populate('visitor', 'name accessCode')
      .populate('resident', 'name userId apartment')
      .populate('securityOfficer', 'name userId')
      .populate('estate', 'name')
      .sort({ timestamp: -1 });
    
    if (format === 'csv') {
      // Convert to CSV format
      const csvData = logs.map(log => ({
        timestamp: log.timestamp,
        estate: log.estate?.name || '',
        visitor: log.visitor?.name || '',
        resident: log.resident?.name || '',
        securityOfficer: log.securityOfficer?.name || '',
        accessCode: log.accessCode,
        accessMethod: log.accessMethod,
        status: log.status
      }));
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=access_logs.csv');
      
      // Convert to CSV string
      const csvString = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');
      
      return res.send(csvString);
    }
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Export logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  getAllLogs,
  getLogsByEstate,
  getLogsByUser,
  getLogsBySecurity,
  exportLogs
}; 