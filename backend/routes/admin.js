const express = require('express');
const { protect, authorize } = require('../middleware/adminAuth');
const {
  getDashboardStats,
  getRecentActivities,
  getSystemOverview,
  getAllEstates,
  getEstateById,
  createEstate,
  updateEstate,
  deleteEstate,
  getEstateStats
} = require('../controllers/admin');

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByEstate,
  assignUserToEstate,
  removeUserFromEstate
} = require('../controllers/adminUsers');

const {
  getAllSecurity,
  getSecurityById,
  createSecurity,
  updateSecurity,
  deleteSecurity,
  getSecurityByEstate,
  assignSecurityToEstate,
  removeSecurityFromEstate
} = require('../controllers/adminSecurity');

const {
  getAllVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
  getVisitorsByEstate,
  getVisitorLogs
} = require('../controllers/adminVisitors');

const {
  getAllLogs,
  getLogsByEstate,
  getLogsByUser,
  getLogsBySecurity,
  exportLogs
} = require('../controllers/adminLogs');

const router = express.Router();

// All routes are protected
router.use(protect);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activities', getRecentActivities);
router.get('/dashboard/overview', getSystemOverview);

// Estate Management routes
router.get('/estates', getAllEstates);
router.get('/estates/:id', getEstateById);
router.post('/estates', createEstate);
router.put('/estates/:id', updateEstate);
router.delete('/estates/:id', deleteEstate);
router.get('/estates/:id/stats', getEstateStats);

// User Management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/estates/:estateId/users', getUsersByEstate);
router.post('/users/:userId/assign-estate', assignUserToEstate);
router.delete('/users/:userId/estates/:estateId', removeUserFromEstate);

// Security Personnel Management routes
router.get('/security', getAllSecurity);
router.get('/security/:id', getSecurityById);
router.post('/security', createSecurity);
router.put('/security/:id', updateSecurity);
router.delete('/security/:id', deleteSecurity);
router.get('/estates/:estateId/security', getSecurityByEstate);
router.post('/security/:securityId/assign-estate', assignSecurityToEstate);
router.delete('/security/:securityId/estates/:estateId', removeSecurityFromEstate);

// Visitor Management routes
router.get('/visitors', getAllVisitors);
router.get('/visitors/:id', getVisitorById);
router.put('/visitors/:id', updateVisitor);
router.delete('/visitors/:id', deleteVisitor);
router.get('/estates/:estateId/visitors', getVisitorsByEstate);
router.get('/visitors/logs', getVisitorLogs);

// Access Logs routes
router.get('/logs', getAllLogs);
router.get('/estates/:estateId/logs', getLogsByEstate);
router.get('/users/:userId/logs', getLogsByUser);
router.get('/security/:securityId/logs', getLogsBySecurity);
router.get('/logs/export', exportLogs);

// QR Code Management routes - TODO: Implement QR code functionality
// router.post('/estates/:estateId/qr-code', generateQRCodeForEstate);
// router.get('/estates/:estateId/qr-history', getQRCodeHistory);
// router.delete('/qr-codes/:qrCodeId', revokeQRCode);
// router.post('/qr-codes/verify', verifyQRCode);

// Emergency Management routes - TODO: Implement emergency management
// router.get('/emergency', getAllEmergencies);
// router.get('/emergency/:id', getEmergencyById);
// router.put('/emergency/:id', updateEmergency);
// router.post('/emergency/:id/resolve', resolveEmergency);
// router.delete('/emergency/:id', deleteEmergency);
// router.get('/estates/:estateId/emergency', getEmergenciesByEstate);

// Maintenance Management routes - TODO: Implement maintenance management
// router.get('/maintenance', getAllMaintenance);
// router.get('/maintenance/:id', getMaintenanceById);
// router.put('/maintenance/:id', updateMaintenance);
// router.post('/maintenance/:id/assign', assignMaintenance);
// router.post('/maintenance/:id/complete', completeMaintenance);
// router.delete('/maintenance/:id', deleteMaintenance);
// router.get('/estates/:estateId/maintenance', getMaintenanceByEstate);

// Notification Management routes - TODO: Implement notification management
// router.get('/notifications', getAllNotifications);
// router.post('/notifications', sendNotification);
// router.put('/notifications/:id', updateNotification);
// router.delete('/notifications/:id', deleteNotification);
// router.put('/notifications/:id/read', markNotificationAsRead);
// router.put('/notifications/mark-all-read', markAllNotificationsAsRead);
// router.get('/estates/:estateId/notifications', getNotificationsByEstate);

// System Settings routes - TODO: Implement system settings
// router.get('/settings', getSystemSettings);
// router.put('/settings', updateSystemSettings);
// router.get('/settings/backup', getSystemBackup);
// router.post('/settings/restore', restoreSystemBackup);

module.exports = router; 