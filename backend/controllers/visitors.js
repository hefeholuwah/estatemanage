const Visitor = require('../models/Visitor');
const User = require('../models/User');
const QRCode = require('qrcode');

// @desc    Register a new visitor
// @route   POST /api/visitors
// @access  Private
exports.registerVisitor = async (req, res) => {
  try {
    req.body.resident = req.user.id;
    const { name, visitDate, visitTime } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide visitor name'
      });
    }

    // Get the resident's estate
    const resident = await User.findById(req.user.id).select('estate');
    if (!resident || !resident.estate) {
      return res.status(400).json({
        success: false,
        message: 'Resident is not assigned to an estate'
      });
    }

    // Add estate to visitor data
    req.body.estate = resident.estate;

    // Ensure we have default values
    req.body.purpose = req.body.purpose || 'Visit';
    
    // Create visitor
    const visitor = await Visitor.create(req.body);
    
    console.log(`Visitor created: ${visitor.name}, Access code: ${visitor.accessCode}`);
    
    // Generate QR code as data URL
    const qrData = JSON.stringify({
      visitorId: visitor._id,
      accessCode: visitor.accessCode,
      residentId: req.user.id
    });
    
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);
    visitor.qrCode = qrCodeDataUrl;
    await visitor.save();

    res.status(201).json({
      success: true,
      data: visitor
    });
  } catch (err) {
    console.error('Error registering visitor:', err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get all visitors for a resident
// @route   GET /api/visitors
// @access  Private
exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ resident: req.user.id });

    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get a single visitor
// @route   GET /api/visitors/:id
// @access  Private
exports.getVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found'
      });
    }

    // Make sure user owns the visitor record or is security staff
    if (visitor.resident.toString() !== req.user.id && req.user.role !== 'security') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this visitor'
      });
    }

    res.status(200).json({
      success: true,
      data: visitor
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Verify visitor access code
// @route   POST /api/visitors/verify
// @access  Private (Security)
exports.verifyAccessCode = async (req, res) => {
  try {
    const { accessCode } = req.body;

    if (!accessCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an access code'
      });
    }

    console.log(`Verifying access code: ${accessCode}`);

    // Find visitor with the provided access code
    const visitor = await Visitor.findOne({ accessCode }).populate({
      path: 'resident',
      select: 'name apartment phone'
    });

    console.log(`Visitor found: ${visitor ? 'Yes' : 'No'}`);

    // Check if visitor exists and access code is valid
    if (!visitor) {
      return res.status(200).json({
        success: false,
        message: 'Invalid access code'
      });
    }

    console.log(`Visitor expiration: ${visitor.expiresAt}, Current time: ${new Date()}`);

    // Check if access code has expired
    if (visitor.expiresAt < new Date()) {
      return res.status(200).json({
        success: false,
        message: 'Access code has expired'
      });
    }

    // Create a safe visitor object without sensitive data
    const safeVisitor = {
      _id: visitor._id,
      name: visitor.name,
      phone: visitor.phone || 'Not provided',
      email: visitor.email || 'Not provided',
      purpose: visitor.purpose || 'Visit',
      accessCode: visitor.accessCode,
      expiresAt: visitor.expiresAt,
      resident: visitor.resident ? {
        name: visitor.resident.name,
        apartment: visitor.resident.apartment,
        phone: visitor.resident.phone || 'Not provided'
      } : {
        name: 'Unknown',
        apartment: 'Unknown'
      }
    };

    console.log('Sending successful verification response');
    
    res.status(200).json({
      success: true,
      message: 'Access code verified successfully',
      visitor: safeVisitor
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
}; 