import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Register API error:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        error: error
      };
    }
  },

  // Login a user
  login: async (userId, password) => {
    try {
      const response = await api.post('/auth/login', { userId, password });
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      // Return a standardized error response with more detailed error message
      return {
        success: false,
        message: error.response?.data?.message || 
                (error.response?.status === 401 ? 'Invalid User ID or password' : 'Authentication failed'),
        error: error
      };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Logout a user
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  // Admin: Create user
  createUser: async (userData) => {
    try {
      const response = await api.post('/auth/create-user', userData);
      return response.data;
    } catch (error) {
      console.error('Create user API error:', error);
      // Return a standardized error response
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to create user',
        error: error
      };
    }
  },

  // Admin: Get all users
  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  // Admin: Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/auth/users/${userId}`, userData);
    return response.data;
  },

  // Admin: Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
  },
};

// Visitor services
export const visitorService = {
  // Register a new visitor
  registerVisitor: async (visitorData) => {
    const response = await api.post('/visitors', visitorData);
    return response.data;
  },

  // Get visitor details
  getVisitor: async (id) => {
    const response = await api.get(`/visitors/${id}`);
    return response.data;
  },

  // Get all visitors for a resident
  getVisitors: async () => {
    const response = await api.get('/visitors');
    return response.data;
  },

  // Verify visitor access code (security)
  verifyAccessCode: async (accessCode) => {
    try {
      console.log('Calling API to verify access code:', accessCode);
      const response = await api.post('/visitors/verify', { accessCode });
      console.log('API response:', JSON.stringify(response.data));
      
      // Check if we have a successful response with visitor data
      if (response.data.success && response.data.visitor) {
        // If verification is successful, record an access log
        try {
          await logService.createLog({
            visitorId: response.data.visitor._id,
            accessType: 'entry',
            verificationMethod: 'code'
          });
        } catch (error) {
          console.error('Error creating access log:', error);
        }
        
        return {
          success: true,
          message: response.data.message || 'Access Granted',
          visitor: response.data.visitor
        };
      } 
      
      // If the response has visitor data in a different structure (data.data.visitor)
      else if (response.data.data && response.data.data.visitor) {
        try {
          await logService.createLog({
            visitorId: response.data.data.visitor._id,
            accessType: 'entry',
            verificationMethod: 'code'
          });
        } catch (error) {
          console.error('Error creating access log:', error);
        }
        
        return {
          success: true,
          message: 'Access Granted',
          visitor: response.data.data.visitor,
          resident: response.data.data.resident
        };
      }
      
      // If verification failed
      return {
        success: false,
        message: response.data.message || 'Access Denied: Invalid or expired code',
        rawResponse: response.data
      };
    } catch (error) {
      console.error('API Error - verifyAccessCode:', error);
      // Return a standardized error response
      return {
        success: false,
        message: error.response?.data?.message || 'Network error during verification',
        error: error
      };
    }
  },
  
  // Verify visitor by QR code data
  verifyQRCode: async (qrData) => {
    try {
      // Extract access code from QR data if it's in a different format
      let accessCode = qrData;
      
      // If QR contains JSON data, parse it
      if (qrData.startsWith('{') && qrData.endsWith('}')) {
        try {
          const parsedData = JSON.parse(qrData);
          accessCode = parsedData.accessCode || parsedData.code || qrData;
        } catch (error) {
          console.error('Error parsing QR data:', error);
        }
      }
      
      // Use the standard verification method with the extracted code
      return await visitorService.verifyAccessCode(accessCode);
    } catch (error) {
      console.error('API Error - verifyQRCode:', error);
      return {
        success: false,
        message: 'Failed to process QR code',
        error: error
      };
    }
  }
};

// Access log services
export const logService = {
  // Create a new access log entry
  createLog: async (logData) => {
    try {
      // Make sure visitorId exists
      if (!logData.visitorId) {
        console.warn('Cannot create access log: Missing visitor ID');
        return { success: false, message: 'Missing visitor ID' };
      }
      
      const response = await api.post('/logs/create', logData);
      return response.data;
    } catch (error) {
      console.error('API Error - createLog:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create access log'
      };
    }
  },
  
  // Get all access logs
  getLogs: async () => {
    const response = await api.get('/logs');
    return response.data;
  },

  // Get access logs for resident
  getResidentLogs: async () => {
    const response = await api.get('/logs/resident');
    return response.data;
  },
};

// Emergency services
export const emergencyService = {
  // Create emergency alert
  createEmergencyAlert: async (emergencyData) => {
    const response = await api.post('/emergency', emergencyData);
    return response.data;
  },

  // Get all emergency alerts (security)
  getEmergencyAlerts: async () => {
    const response = await api.get('/emergency');
    return response.data;
  },

  // Get resident's emergency alerts
  getMyEmergencyAlerts: async () => {
    const response = await api.get('/emergency/my-alerts');
    return response.data;
  },

  // Update emergency alert
  updateEmergencyAlert: async (id, updateData) => {
    const response = await api.put(`/emergency/${id}`, updateData);
    return response.data;
  },

  // Add note to emergency alert
  addEmergencyNote: async (id, note) => {
    const response = await api.post(`/emergency/${id}/notes`, { note });
    return response.data;
  },
};

// Maintenance services
export const maintenanceService = {
  // Create maintenance request
  createMaintenanceRequest: async (maintenanceData) => {
    const response = await api.post('/maintenance', maintenanceData);
    return response.data;
  },

  // Get all maintenance requests (staff)
  getMaintenanceRequests: async (filters = {}) => {
    const response = await api.get('/maintenance', { params: filters });
    return response.data;
  },

  // Get resident's maintenance requests
  getMyMaintenanceRequests: async () => {
    const response = await api.get('/maintenance/my-requests');
    return response.data;
  },

  // Update maintenance request
  updateMaintenanceRequest: async (id, updateData) => {
    const response = await api.put(`/maintenance/${id}`, updateData);
    return response.data;
  },

  // Add note to maintenance request
  addMaintenanceNote: async (id, note) => {
    const response = await api.post(`/maintenance/${id}/notes`, { note });
    return response.data;
  },
};

// Notification services
export const notificationService = {
  // Get user's notifications
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
}; 