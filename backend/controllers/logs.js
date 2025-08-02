const AccessLog = require('../models/AccessLog');
const Visitor = require('../models/Visitor');

// @desc    Create access log
// @route   POST /api/logs
// @access  Private (Security only)
exports.createAccessLog = async (req, res) => {
  try {
    // Add security officer to request body
    req.body.securityOfficer = req.user.id;
    
    // Check if we have a visitor ID
    if (!req.body.visitorId) {
      return res.status(400).json({
        success: false,
        message: 'Visitor ID is required'
      });
    }
    
    const visitor = await Visitor.findById(req.body.visitorId);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found'
      });
    }
    
    // Add resident to request body and set visitor field
    req.body.resident = visitor.resident;
    req.body.visitor = visitor._id;

    const accessLog = await AccessLog.create(req.body);

    // Update visitor status if access was granted
    if (req.body.status === 'granted') {
      visitor.status = 'used';
      await visitor.save();
    }

    res.status(201).json({
      success: true,
      data: accessLog
    });
  } catch (err) {
    console.error('Error creating access log:', err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get all access logs
// @route   GET /api/logs
// @access  Private (Security only)
exports.getAccessLogs = async (req, res) => {
  try {
    const logs = await AccessLog.find()
      .populate({
        path: 'visitor',
        select: 'name visitDate visitTime'
      })
      .populate({
        path: 'resident',
        select: 'name apartment'
      })
      .populate({
        path: 'securityOfficer',
        select: 'name'
      });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get logs for a specific resident
// @route   GET /api/logs/resident
// @access  Private
exports.getResidentLogs = async (req, res) => {
  try {
    const logs = await AccessLog.find({ resident: req.user.id })
      .populate({
        path: 'visitor',
        select: 'name visitDate visitTime'
      })
      .populate({
        path: 'securityOfficer',
        select: 'name'
      });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}; 