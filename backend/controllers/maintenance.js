const MaintenanceRequest = require('../models/MaintenanceRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create maintenance request
// @route   POST /api/maintenance
// @access  Private
exports.createMaintenanceRequest = async (req, res) => {
  try {
    req.body.resident = req.user.id;
    
    const maintenanceRequest = await MaintenanceRequest.create(req.body);
    
    // Create notification for maintenance staff
    const maintenanceStaff = await User.find({ role: 'maintenance' });
    
    for (const staff of maintenanceStaff) {
      await Notification.create({
        recipient: staff._id,
        type: 'maintenance',
        title: `Maintenance Request - ${req.body.category}`,
        message: `New maintenance request from ${req.user.name} in ${req.body.location}: ${req.body.title}`,
        relatedEntity: maintenanceRequest._id,
        relatedEntityModel: 'MaintenanceRequest',
        priority: req.body.priority === 'urgent' ? 'high' : 'medium'
      });
    }
    
    res.status(201).json({
      success: true,
      data: maintenanceRequest
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get all maintenance requests (for staff)
// @route   GET /api/maintenance
// @access  Private (Staff only)
exports.getMaintenanceRequests = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    
    const requests = await MaintenanceRequest.find(filter)
      .populate('resident', 'name apartment')
      .populate('assignedTo', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get resident's maintenance requests
// @route   GET /api/maintenance/my-requests
// @access  Private
exports.getMyMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ resident: req.user.id })
      .populate('assignedTo', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update maintenance request
// @route   PUT /api/maintenance/:id
// @access  Private (Staff only)
exports.updateMaintenanceRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }
    
    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('resident', 'name apartment');
    
    // Create notification for resident
    await Notification.create({
      recipient: request.resident,
      type: 'maintenance',
      title: 'Maintenance Request Update',
      message: `Your maintenance request has been updated to: ${req.body.status}`,
      relatedEntity: request._id,
      relatedEntityModel: 'MaintenanceRequest'
    });
    
    res.status(200).json({
      success: true,
      data: updatedRequest
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Add note to maintenance request
// @route   POST /api/maintenance/:id/notes
// @access  Private
exports.addMaintenanceNote = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }
    
    request.notes.push({
      note: req.body.note,
      createdBy: req.user.id
    });
    
    await request.save();
    
    res.status(200).json({
      success: true,
      data: request
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}; 