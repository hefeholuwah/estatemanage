const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB connection string - hardcoded for now since env variables have issues
const MONGO_URI = 'mongodb+srv://admin:Admin123@estate.eebt4bf.mongodb.net/estatedb';
const JWT_SECRET = 'estate_management_secret_key';
const JWT_EXPIRE = '30d';
const ACCESS_CODE_EXPIRE_TIME = 1800000;

// Make these available globally
process.env.MONGO_URI = MONGO_URI;
process.env.JWT_SECRET = JWT_SECRET;
process.env.JWT_EXPIRE = JWT_EXPIRE;
process.env.ACCESS_CODE_EXPIRE_TIME = ACCESS_CODE_EXPIRE_TIME;

// Route files
const auth = require('./routes/auth');
const adminAuth = require('./routes/adminAuth');
const visitors = require('./routes/visitors');
const logs = require('./routes/logs');
const emergency = require('./routes/emergency');
const maintenance = require('./routes/maintenance');
const notifications = require('./routes/notifications');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/auth/admin', adminAuth);
app.use('/api/visitors', visitors);
app.use('/api/logs', logs);
app.use('/api/emergency', emergency);
app.use('/api/maintenance', maintenance);
app.use('/api/notifications', notifications);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('EstateOne API is running...');
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to database before starting server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}); 