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
    validate: {
      validator: function(v) {
        return /^\d{4}$/.test(v);
      },
      message: 'Access code must be exactly 4 digits'
    }
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
    generateUniqueAccessCode.call(this, next);
  } else {
    next();
  }
});

// Function to generate unique access code
async function generateUniqueAccessCode(next) {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    // Generate a more secure 4-digit PIN using crypto
    const randomBytes = crypto.randomBytes(2);
    const randomNumber = randomBytes.readUInt16BE(0);
    const pin = (1000 + (randomNumber % 9000)).toString();
    
    // Check if this PIN already exists
    const existingVisitor = await this.constructor.findOne({ accessCode: pin });
    
    if (!existingVisitor) {
      this.accessCode = pin;
      console.log(`Generated secure access code: ${pin} for visitor: ${this.name}`);
      console.log(`Random bytes: ${randomBytes.toString('hex')}, Random number: ${randomNumber}, Final PIN: ${pin}`);
      return next();
    }
    
    attempts++;
    console.log(`Access code ${pin} already exists, trying again... (attempt ${attempts})`);
  }
  
  // If we can't generate a unique code after max attempts, use timestamp-based code
  const timestamp = Date.now().toString().slice(-4);
  this.accessCode = timestamp;
  console.log(`Using timestamp-based access code: ${timestamp} for visitor: ${this.name}`);
  next();
}

module.exports = mongoose.model('Visitor', VisitorSchema); 