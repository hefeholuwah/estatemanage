const mongoose = require('mongoose');

const AccessLogSchema = new mongoose.Schema({
  visitor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Visitor',
    required: true
  },
  resident: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  securityOfficer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  accessCode: {
    type: String,
    required: true
  },
  accessMethod: {
    type: String,
    enum: ['qr-scan', 'pin-entry'],
    required: true
  },
  status: {
    type: String,
    enum: ['granted', 'denied'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AccessLog', AccessLogSchema); 