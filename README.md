# EstateOne - Estate Management System

A comprehensive estate management application built with React Native (Expo) frontend and Node.js backend with MongoDB integration.

## 🏗️ Features

### For Residents
- **Visitor Management**: Register visitors and generate QR codes for access
- **Emergency Alerts**: Report emergencies with priority levels and real-time notifications
- **Maintenance Requests**: Submit maintenance requests with categories and tracking
- **Access Logs**: View visitor entry/exit logs
- **Notifications**: Real-time notifications for all activities

### For Security Staff
- **QR Code Verification**: Scan visitor QR codes for access verification
- **Emergency Response**: View and manage emergency alerts
- **Access Control**: Monitor all building access
- **Visitor Management**: Approve/deny visitor access

### For Maintenance Staff
- **Request Management**: View and update maintenance requests
- **Work Assignment**: Get assigned tasks with priority levels
- **Status Updates**: Update request status and add notes

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Expo CLI
- React Native development environment

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Seed the database:**
   ```bash
   node seeder.js
   ```

4. **Start the backend server:**
   ```bash
   node server.js
   ```

   The backend is deployed on `https://estatemanage.onrender.com`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Expo development server:**
   ```bash
   npx expo start --clear
   ```

3. **Run on device/simulator:**
   - Scan QR code with Expo Go app (Android/iOS)
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator

## 🧪 Test Credentials

### Residents
- **Ayomide Ajayi**: `ayomide001` / `password123`
- **John Smith**: `john002` / `password123`
- **Sarah Johnson**: `sarah003` / `password123`

### Staff
- **Security Officer**: `security001` / `securitypassword`
- **Maintenance Staff**: `maintenance001` / `maintenancepassword`

## 📱 App Flow

### Resident Flow
1. **Login** with resident credentials
2. **Dashboard** shows main options:
   - Register Visitor
   - Emergency Alert
   - Maintenance Request
   - Log Out
3. **Register Visitor**: Enter visitor details and generate QR code
4. **Emergency Alert**: Report emergencies with type, priority, and description
5. **Maintenance Request**: Submit maintenance issues with categories

### Security Flow
1. **Admin Login** with security credentials
2. **Verify Access**: Enter PIN for security verification
3. **Scan QR**: Scan visitor QR codes for access verification
4. **Manage Emergencies**: View and respond to emergency alerts

## 🏗️ Architecture

### Backend Structure
```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── auth.js            # Authentication logic
│   ├── visitors.js        # Visitor management
│   ├── logs.js            # Access logging
│   ├── emergency.js       # Emergency alerts
│   ├── maintenance.js     # Maintenance requests
│   └── notifications.js   # Notification system
├── middleware/
│   └── auth.js            # JWT authentication
├── models/
│   ├── User.js            # User schema
│   ├── Visitor.js         # Visitor schema
│   ├── AccessLog.js       # Access log schema
│   ├── EmergencyAlert.js  # Emergency alert schema
│   ├── MaintenanceRequest.js # Maintenance request schema
│   └── Notification.js    # Notification schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── visitors.js        # Visitor routes
│   ├── logs.js            # Log routes
│   ├── emergency.js       # Emergency routes
│   ├── maintenance.js     # Maintenance routes
│   └── notifications.js   # Notification routes
├── server.js              # Main server file
└── seeder.js              # Database seeder
```

### Frontend Structure
```
src/
├── components/
│   ├── Button.tsx         # Reusable button component
│   ├── InputField.tsx     # Reusable input component
│   ├── StatusBar.tsx      # Status bar component
│   └── UserProfileCard.tsx # User profile display
├── context/
│   └── AuthContext.tsx    # Authentication context
├── navigation/
│   └── AppNavigator.tsx   # Navigation configuration
├── screens/
│   ├── LoginScreen.tsx    # User login
│   ├── DashboardScreen.tsx # Main dashboard
│   ├── RegisterVisitorScreen.tsx # Visitor registration
│   ├── QRCodeScreen.tsx   # QR code display
│   ├── EmergencyAlertScreen.tsx # Emergency reporting
│   ├── MaintenanceRequestScreen.tsx # Maintenance requests
│   └── AdminScreen/       # Admin-specific screens
└── utils/
    └── api.js             # API service functions
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Visitors
- `POST /api/visitors` - Register visitor
- `GET /api/visitors` - Get all visitors (resident)
- `GET /api/visitors/:id` - Get specific visitor
- `POST /api/visitors/verify` - Verify access code (security)

### Access Logs
- `POST /api/logs` - Create access log
- `GET /api/logs` - Get all logs (security)
- `GET /api/logs/resident` - Get resident logs

### Emergency Alerts
- `POST /api/emergency` - Create emergency alert
- `GET /api/emergency` - Get all alerts (security)
- `GET /api/emergency/my-alerts` - Get resident alerts
- `PUT /api/emergency/:id` - Update alert (security)
- `POST /api/emergency/:id/notes` - Add note to alert

### Maintenance Requests
- `POST /api/maintenance` - Create maintenance request
- `GET /api/maintenance` - Get all requests (staff)
- `GET /api/maintenance/my-requests` - Get resident requests
- `PUT /api/maintenance/:id` - Update request (staff)
- `POST /api/maintenance/:id/notes` - Add note to request

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `GET /api/notifications/unread-count` - Get unread count
- `DELETE /api/notifications/:id` - Delete notification

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for residents, security, and maintenance
- **Password Hashing**: Bcrypt password encryption
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin resource sharing configuration

## 📊 Database Schema

### User Model
- `name`: User's full name
- `userId`: Unique user identifier
- `password`: Hashed password
- `apartment`: Apartment number
- `role`: User role (resident, security, maintenance)
- `profileImage`: Profile picture URL

### Visitor Model
- `name`: Visitor's name
- `visitDate`: Date of visit
- `visitTime`: Time of visit
- `resident`: Reference to resident
- `accessCode`: Generated access code
- `status`: Visit status

### Emergency Alert Model
- `resident`: Reference to reporting resident
- `type`: Emergency type (fire, medical, security, etc.)
- `priority`: Priority level (low, medium, high, critical)
- `description`: Emergency description
- `location`: Emergency location
- `status`: Alert status
- `assignedTo`: Assigned staff member
- `notes`: Staff notes

### Maintenance Request Model
- `resident`: Reference to requesting resident
- `category`: Request category (plumbing, electrical, etc.)
- `title`: Request title
- `description`: Detailed description
- `location`: Issue location
- `priority`: Priority level
- `status`: Request status
- `assignedTo`: Assigned maintenance staff
- `notes`: Staff notes

## 🚨 Emergency Features

- **Real-time Alerts**: Instant notification to security staff
- **Priority Levels**: Critical, high, medium, low priority classification
- **Location Tracking**: Precise location reporting
- **Status Updates**: Real-time status tracking
- **Staff Assignment**: Automatic assignment to available staff

## 🔧 Maintenance Features

- **Category Classification**: Plumbing, electrical, HVAC, etc.
- **Priority Management**: Urgent, high, medium, low priority
- **Status Tracking**: Pending, assigned, in-progress, completed
- **Staff Assignment**: Automatic routing to appropriate staff
- **Progress Notes**: Staff can add notes and updates

## 📱 Mobile Features

- **QR Code Generation**: Secure visitor access codes
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Real-time updates (future enhancement)
- **Camera Integration**: QR code scanning
- **Responsive Design**: Works on all screen sizes

## 🔄 Future Enhancements

- **Push Notifications**: Real-time push notifications
- **File Upload**: Image attachments for maintenance requests
- **Payment Integration**: Maintenance cost tracking
- **Analytics Dashboard**: Usage statistics and reports
- **Multi-language Support**: Internationalization
- **Dark Mode**: Theme customization
- **Voice Commands**: Voice-activated emergency alerts

## 🐛 Troubleshooting

### Backend Issues
1. **MongoDB Connection**: Ensure MongoDB Atlas is accessible
2. **Port Conflicts**: Check if port 5000 is available
3. **Environment Variables**: Verify all required variables are set

### Frontend Issues
1. **Expo Issues**: Clear cache with `npx expo start --clear`
2. **Navigation Errors**: Ensure all screens are properly imported
3. **API Connection**: Verify backend is running on correct port

### Common Commands
```bash
# Clear Expo cache
npx expo start --clear

# Reset database
cd backend && node seeder.js

# Check backend status
curl https://estatemanage.onrender.com

# View logs
cd backend && node server.js
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section

---

**EstateOne** - Modern Estate Management Made Simple
