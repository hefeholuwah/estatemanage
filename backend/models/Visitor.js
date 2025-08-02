const mongoose = require('mongoose');
const crypto = require('crypto');

const VisitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add visitor name'],
    trim: true
  },
  accessCode: {
    type: String,
    unique: true,
  },
  qrCode: {
    type: String
  },
  visitDate: {
    type: Date,
    required: [true, 'Please add a visit date']
  },
  visitTime: {
    type: String,
    required: [true, 'Please add a visit time']
  },
  purpose: {
    type: String,
    default: 'Visit'
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied', 'expired', 'used'],
    default: 'approved'
  },
  resident: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Default to 30 minutes if environment variable is not set
      const expireTime = process.env.ACCESS_CODE_EXPIRE_TIME || 1800000;
      return new Date(Date.now() + parseInt(expireTime));
    }
  }
});

// Generate access code before saving
VisitorSchema.pre('save', function(next) {
  // Only generate access code if it doesn't already exist
  if (!this.accessCode) {
    // Generate a 4-digit PIN
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    this.accessCode = pin;
    console.log(`Generated access code: ${pin} for visitor: ${this.name}`);
  }
  next();
});

module.exports = mongoose.model('Visitor', VisitorSchema); 