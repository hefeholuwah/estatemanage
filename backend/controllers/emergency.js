const EmergencyAlert = require('../models/EmergencyAlert');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create emergency alert
// @route   POST /api/emergency
// @access  Private
exports.createEmergencyAlert = async (req, res) => {
  try {
    req.body.resident = req.user.id;
    
    const emergencyAlert = await EmergencyAlert.create(req.body);
    
    // Create notification for security staff
    const securityStaff = await User.find({ role: 'security' });
    
    for (const staff of securityStaff) {
      await Notification.create({
        recipient: staff._id,
        type: 'emergency',
        title: `Emergency Alert - ${req.body.type.toUpperCase()}`,
        message: `Emergency reported by ${req.user.name} in ${req.body.location}: ${req.body.description}`,
        relatedEntity: emergencyAlert._id,
        relatedEntityModel: 'EmergencyAlert',
        priority: req.body.priority === 'critical' ? 'urgent' : 'high'
      });
    }
    
    res.status(201).json({
      success: true,
      data: emergencyAlert
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get all emergency alerts (for security)
// @route   GET /api/emergency
// @access  Private (Security only)
exports.getEmergencyAlerts = async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find()
      .populate('resident', 'name apartment')
      .populate('assignedTo', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get resident's emergency alerts
// @route   GET /api/emergency/my-alerts
// @access  Private
exports.getMyEmergencyAlerts = async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({ resident: req.user.id })
      .populate('assignedTo', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update emergency alert status
// @route   PUT /api/emergency/:id
// @access  Private (Security only)
exports.updateEmergencyAlert = async (req, res) => {
  try {
    const alert = await EmergencyAlert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Emergency alert not found'
      });
    }
    
    // Update alert
    const updatedAlert = await EmergencyAlert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('resident', 'name apartment');
    
    // Create notification for resident
    await Notification.create({
      recipient: alert.resident,
      type: 'emergency',
      title: 'Emergency Alert Update',
      message: `Your emergency alert has been updated to: ${req.body.status}`,
      relatedEntity: alert._id,
      relatedEntityModel: 'EmergencyAlert'
    });
    
    res.status(200).json({
      success: true,
      data: updatedAlert
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Add note to emergency alert
// @route   POST /api/emergency/:id/notes
// @access  Private (Security only)
exports.addEmergencyNote = async (req, res) => {
  try {
    const alert = await EmergencyAlert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Emergency alert not found'
      });
    }
    
    alert.notes.push({
      note: req.body.note,
      createdBy: req.user.id
    });
    
    await alert.save();
    
    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}; 