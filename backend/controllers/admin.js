const Estate = require('../models/Estate');
const User = require('../models/User');
const Visitor = require('../models/Visitor');
const AccessLog = require('../models/AccessLog');
const EmergencyAlert = require('../models/EmergencyAlert');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Notification = require('../models/Notification');
const QRCode = require('qrcode');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const admin = req.admin;
    
    // Get estates managed by this admin
    let estatesQuery = {};
    if (admin.role !== 'super_admin') {
      estatesQuery = { createdBy: admin._id };
    }
    
    const estates = await Estate.find(estatesQuery);
    const estateIds = estates.map(estate => estate._id);
    
    // Get statistics
    const totalEstates = estates.length;
    const totalUsers = await User.countDocuments({ estate: { $in: estateIds } });
    const totalVisitors = await Visitor.countDocuments({ estate: { $in: estateIds } });
    const totalSecurity = await User.countDocuments({ 
      estate: { $in: estateIds }, 
      role: 'security' 
    });
    const pendingEmergencies = await EmergencyAlert.countDocuments({
      estate: { $in: estateIds },
      status: { $in: ['pending', 'acknowledged'] }
    });
    const pendingMaintenance = await MaintenanceRequest.countDocuments({
      estate: { $in: estateIds },
      status: { $in: ['pending', 'assigned'] }
    });
    
    // Get today's statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVisitors = await Visitor.countDocuments({
      estate: { $in: estateIds },
      createdAt: { $gte: today }
    });
    
    const todayAccessLogs = await AccessLog.countDocuments({
      estate: { $in: estateIds },
      timestamp: { $gte: today }
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalEstates,
        totalUsers,
        totalVisitors,
        totalSecurity,
        pendingEmergencies,
        pendingMaintenance,
        todayVisitors,
        todayAccessLogs
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get recent activities
// @route   GET /api/admin/dashboard/activities
// @access  Private
const getRecentActivities = async (req, res) => {
  try {
    const admin = req.admin;
    
    // Get estates managed by this admin
    let estatesQuery = {};
    if (admin.role !== 'super_admin') {
      estatesQuery = { createdBy: admin._id };
    }
    
    const estates = await Estate.find(estatesQuery);
    const estateIds = estates.map(estate => estate._id);
    
    // Get recent activities from different collections
    const recentVisitors = await Visitor.find({ estate: { $in: estateIds } })
      .populate('resident', 'name userId')
      .populate('estate', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const recentEmergencies = await EmergencyAlert.find({ estate: { $in: estateIds } })
      .populate('resident', 'name userId')
      .populate('estate', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const recentMaintenance = await MaintenanceRequest.find({ estate: { $in: estateIds } })
      .populate('resident', 'name userId')
      .populate('estate', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const recentAccessLogs = await AccessLog.find({ estate: { $in: estateIds } })
      .populate('visitor', 'name')
      .populate('resident', 'name userId')
      .populate('estate', 'name')
      .sort({ timestamp: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      data: {
        visitors: recentVisitors,
        emergencies: recentEmergencies,
        maintenance: recentMaintenance,
        accessLogs: recentAccessLogs
      }
    });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get system overview
// @route   GET /api/admin/dashboard/overview
// @access  Private
const getSystemOverview = async (req, res) => {
  try {
    const admin = req.admin;
    
    // Get estates managed by this admin
    let estatesQuery = {};
    if (admin.role !== 'super_admin') {
      estatesQuery = { createdBy: admin._id };
    }
    
    const estates = await Estate.find(estatesQuery);
    const estateIds = estates.map(estate => estate._id);
    
    // Get overview data
    const estatesWithStats = await Promise.all(
      estates.map(async (estate) => {
        const users = await User.countDocuments({ estate: estate._id });
        const security = await User.countDocuments({ 
          estate: estate._id, 
          role: 'security' 
        });
        const visitors = await Visitor.countDocuments({ estate: estate._id });
        const emergencies = await EmergencyAlert.countDocuments({ 
          estate: estate._id,
          status: { $in: ['pending', 'acknowledged'] }
        });
        
        return {
          ...estate.toObject(),
          stats: { users, security, visitors, emergencies }
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: estatesWithStats
    });
  } catch (error) {
    console.error('System overview error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get all estates
// @route   GET /api/admin/estates
// @access  Private
const getAllEstates = async (req, res) => {
  try {
    const admin = req.admin;
    
    let query = {};
    if (admin.role !== 'super_admin') {
      query = { createdBy: admin._id };
    }
    
    const estates = await Estate.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: estates.length,
      data: estates
    });
  } catch (error) {
    console.error('Get estates error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single estate
// @route   GET /api/admin/estates/:id
// @access  Private
const getEstateById = async (req, res) => {
  try {
    const estate = await Estate.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('users', 'name userId apartment role')
      .populate('security', 'name userId apartment')
      .populate('visitors', 'name visitDate status')
      .populate('emergencies', 'type priority status description')
      .populate('maintenanceRequests', 'title category priority status');
    
    if (!estate) {
      return res.status(404).json({
        success: false,
        error: 'Estate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: estate
    });
  } catch (error) {
    console.error('Get estate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new estate
// @route   POST /api/admin/estates
// @access  Private
const createEstate = async (req, res) => {
  try {
    const estate = await Estate.create({
      ...req.body,
      createdBy: req.admin._id
    });
    
    res.status(201).json({
      success: true,
      data: estate
    });
  } catch (error) {
    console.error('Create estate error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update estate
// @route   PUT /api/admin/estates/:id
// @access  Private
const updateEstate = async (req, res) => {
  try {
    const estate = await Estate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!estate) {
      return res.status(404).json({
        success: false,
        error: 'Estate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: estate
    });
  } catch (error) {
    console.error('Update estate error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete estate
// @route   DELETE /api/admin/estates/:id
// @access  Private
const deleteEstate = async (req, res) => {
  try {
    const estate = await Estate.findById(req.params.id);
    
    if (!estate) {
      return res.status(404).json({
        success: false,
        error: 'Estate not found'
      });
    }
    
    // Check if estate has users or other related data
    const usersCount = await User.countDocuments({ estate: estate._id });
    const visitorsCount = await Visitor.countDocuments({ estate: estate._id });
    
    if (usersCount > 0 || visitorsCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete estate with existing users or visitors'
      });
    }
    
    await estate.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete estate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get estate statistics
// @route   GET /api/admin/estates/:id/stats
// @access  Private
const getEstateStats = async (req, res) => {
  try {
    const estateId = req.params.id;
    
    const users = await User.countDocuments({ estate: estateId });
    const security = await User.countDocuments({ 
      estate: estateId, 
      role: 'security' 
    });
    const residents = await User.countDocuments({ 
      estate: estateId, 
      role: 'resident' 
    });
    const visitors = await Visitor.countDocuments({ estate: estateId });
    const emergencies = await EmergencyAlert.countDocuments({ estate: estateId });
    const maintenance = await MaintenanceRequest.countDocuments({ estate: estateId });
    
    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVisitors = await Visitor.countDocuments({
      estate: estateId,
      createdAt: { $gte: today }
    });
    
    const todayAccessLogs = await AccessLog.countDocuments({
      estate: estateId,
      timestamp: { $gte: today }
    });
    
    res.status(200).json({
      success: true,
      data: {
        users,
        security,
        residents,
        visitors,
        emergencies,
        maintenance,
        todayVisitors,
        todayAccessLogs
      }
    });
  } catch (error) {
    console.error('Estate stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Export all functions
module.exports = {
  getDashboardStats,
  getRecentActivities,
  getSystemOverview,
  getAllEstates,
  getEstateById,
  createEstate,
  updateEstate,
  deleteEstate,
  getEstateStats
}; 