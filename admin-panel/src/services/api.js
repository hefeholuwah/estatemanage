import axios from 'axios';

// Create axios instance for admin API
export const adminApi = axios.create({
  baseURL: 'https://estatemanage.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Estate Management API
export const estateApi = {
  // Get all estates
  getAll: () => adminApi.get('/admin/estates'),
  
  // Get single estate
  getById: (id) => adminApi.get(`/admin/estates/${id}`),
  
  // Create estate
  create: (data) => adminApi.post('/admin/estates', data),
  
  // Update estate
  update: (id, data) => adminApi.put(`/admin/estates/${id}`, data),
  
  // Delete estate
  delete: (id) => adminApi.delete(`/admin/estates/${id}`),
  
  // Get estate statistics
  getStats: (id) => adminApi.get(`/admin/estates/${id}/stats`),
};

// User Management API
export const userApi = {
  // Get all users
  getAll: (params) => adminApi.get('/admin/users', { params }),
  
  // Get single user
  getById: (id) => adminApi.get(`/admin/users/${id}`),
  
  // Create user
  create: (data) => adminApi.post('/admin/users', data),
  
  // Update user
  update: (id, data) => adminApi.put(`/admin/users/${id}`, data),
  
  // Delete user
  delete: (id) => adminApi.delete(`/admin/users/${id}`),
  
  // Get users by estate
  getByEstate: (estateId) => adminApi.get(`/admin/estates/${estateId}/users`),
  
  // Assign user to estate
  assignToEstate: (userId, estateId) => 
    adminApi.post(`/admin/users/${userId}/assign-estate`, { estateId }),
  
  // Remove user from estate
  removeFromEstate: (userId, estateId) => 
    adminApi.delete(`/admin/users/${userId}/estates/${estateId}`),
};

// Security Personnel API
export const securityApi = {
  // Get all security personnel
  getAll: (params) => adminApi.get('/admin/security', { params }),
  
  // Get single security personnel
  getById: (id) => adminApi.get(`/admin/security/${id}`),
  
  // Create security personnel
  create: (data) => adminApi.post('/admin/security', data),
  
  // Update security personnel
  update: (id, data) => adminApi.put(`/admin/security/${id}`, data),
  
  // Delete security personnel
  delete: (id) => adminApi.delete(`/admin/security/${id}`),
  
  // Get security personnel by estate
  getByEstate: (estateId) => adminApi.get(`/admin/estates/${estateId}/security`),
  
  // Assign security to estate
  assignToEstate: (securityId, estateId) => 
    adminApi.post(`/admin/security/${securityId}/assign-estate`, { estateId }),
  
  // Remove security from estate
  removeFromEstate: (securityId, estateId) => 
    adminApi.delete(`/admin/security/${securityId}/estates/${estateId}`),
};

// Dashboard API
export const dashboardApi = {
  // Get dashboard statistics
  getStats: () => adminApi.get('/admin/dashboard/stats'),
  
  // Get recent activities
  getRecentActivities: () => adminApi.get('/admin/dashboard/activities'),
  
  // Get system overview
  getOverview: () => adminApi.get('/admin/dashboard/overview'),
};

// Visitor Management API
export const visitorApi = {
  // Get all visitors
  getAll: (params) => adminApi.get('/admin/visitors', { params }),
  
  // Get visitors by estate
  getByEstate: (estateId) => adminApi.get(`/admin/estates/${estateId}/visitors`),
  
  // Get visitor details
  getById: (id) => adminApi.get(`/admin/visitors/${id}`),
  
  // Update visitor
  update: (id, data) => adminApi.put(`/admin/visitors/${id}`, data),
  
  // Delete visitor
  delete: (id) => adminApi.delete(`/admin/visitors/${id}`),
  
  // Get visitor logs
  getLogs: (params) => adminApi.get('/admin/visitors/logs', { params }),
};

// Access Logs API
export const accessLogApi = {
  // Get all access logs
  getAll: (params) => adminApi.get('/admin/logs', { params }),
  
  // Get logs by estate
  getByEstate: (estateId) => adminApi.get(`/admin/estates/${estateId}/logs`),
  
  // Get logs by user
  getByUser: (userId) => adminApi.get(`/admin/users/${userId}/logs`),
  
  // Get logs by security personnel
  getBySecurity: (securityId) => adminApi.get(`/admin/security/${securityId}/logs`),
  
  // Export logs
  export: (params) => adminApi.get('/admin/logs/export', { 
    params,
    responseType: 'blob'
  }),
};

// QR Code Management API
export const qrCodeApi = {
  // Generate QR code for estate
  generateForEstate: (estateId) => adminApi.post(`/admin/estates/${estateId}/qr-code`),
  
  // Get QR code history
  getHistory: (estateId) => adminApi.get(`/admin/estates/${estateId}/qr-history`),
  
  // Revoke QR code
  revoke: (qrCodeId) => adminApi.delete(`/admin/qr-codes/${qrCodeId}`),
  
  // Verify QR code
  verify: (qrCode) => adminApi.post('/admin/qr-codes/verify', { qrCode }),
};

// Emergency Management API
export const emergencyApi = {
  // Get all emergency alerts
  getAll: (params) => adminApi.get('/admin/emergency', { params }),
  
  // Get emergency alerts by estate
  getByEstate: (estateId) => adminApi.get(`/admin/estates/${estateId}/emergency`),
  
  // Get emergency alert details
  getById: (id) => adminApi.get(`/admin/emergency/${id}`),
  
  // Update emergency alert
  update: (id, data) => adminApi.put(`/admin/emergency/${id}`, data),
  
  // Resolve emergency alert
  resolve: (id) => adminApi.post(`/admin/emergency/${id}/resolve`),
  
  // Delete emergency alert
  delete: (id) => adminApi.delete(`/admin/emergency/${id}`),
};

// Maintenance Management API
export const maintenanceApi = {
  // Get all maintenance requests
  getAll: (params) => adminApi.get('/admin/maintenance', { params }),
  
  // Get maintenance requests by estate
  getByEstate: (estateId) => adminApi.get(`/admin/estates/${estateId}/maintenance`),
  
  // Get maintenance request details
  getById: (id) => adminApi.get(`/admin/maintenance/${id}`),
  
  // Update maintenance request
  update: (id, data) => adminApi.put(`/admin/maintenance/${id}`, data),
  
  // Assign maintenance request
  assign: (id, assigneeId) => adminApi.post(`/admin/maintenance/${id}/assign`, { assigneeId }),
  
  // Complete maintenance request
  complete: (id) => adminApi.post(`/admin/maintenance/${id}/complete`),
  
  // Delete maintenance request
  delete: (id) => adminApi.delete(`/admin/maintenance/${id}`),
};

// Notification Management API
export const notificationApi = {
  // Get all notifications
  getAll: (params) => adminApi.get('/admin/notifications', { params }),
  
  // Get notifications by estate
  getByEstate: (estateId) => adminApi.get(`/admin/estates/${estateId}/notifications`),
  
  // Send notification
  send: (data) => adminApi.post('/admin/notifications', data),
  
  // Update notification
  update: (id, data) => adminApi.put(`/admin/notifications/${id}`, data),
  
  // Delete notification
  delete: (id) => adminApi.delete(`/admin/notifications/${id}`),
  
  // Mark as read
  markAsRead: (id) => adminApi.put(`/admin/notifications/${id}/read`),
  
  // Mark all as read
  markAllAsRead: () => adminApi.put('/admin/notifications/mark-all-read'),
};

// System Settings API
export const settingsApi = {
  // Get system settings
  get: () => adminApi.get('/admin/settings'),
  
  // Update system settings
  update: (data) => adminApi.put('/admin/settings', data),
  
  // Get backup data
  getBackup: () => adminApi.get('/admin/settings/backup'),
  
  // Restore from backup
  restore: (data) => adminApi.post('/admin/settings/restore', data),
};

// Export all APIs
export default {
  estate: estateApi,
  user: userApi,
  security: securityApi,
  dashboard: dashboardApi,
  visitor: visitorApi,
  accessLog: accessLogApi,
  qrCode: qrCodeApi,
  emergency: emergencyApi,
  maintenance: maintenanceApi,
  notification: notificationApi,
  settings: settingsApi,
}; 