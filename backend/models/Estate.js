const mongoose = require('mongoose');

const EstateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an estate name'],
    trim: true,
    maxlength: [100, 'Estate name cannot be more than 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an estate address'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  contactPhone: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  totalUnits: {
    type: Number,
    default: 0
  },
  amenities: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  qrCode: {
    code: String,
    generatedAt: Date,
    expiresAt: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  settings: {
    allowVisitorRegistration: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    maxVisitorsPerDay: {
      type: Number,
      default: 10
    },
    visitorExpiryHours: {
      type: Number,
      default: 24
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
EstateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for estate statistics
EstateSchema.virtual('stats', {
  ref: 'AccessLog',
  localField: '_id',
  foreignField: 'estate',
  count: true
});

// Virtual for estate users
EstateSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'estate'
});

// Virtual for estate security personnel
EstateSchema.virtual('security', {
  ref: 'User',
  localField: '_id',
  foreignField: 'estate',
  match: { role: 'security' }
});

// Virtual for estate visitors
EstateSchema.virtual('visitors', {
  ref: 'Visitor',
  localField: '_id',
  foreignField: 'estate'
});

// Virtual for estate emergencies
EstateSchema.virtual('emergencies', {
  ref: 'EmergencyAlert',
  localField: '_id',
  foreignField: 'estate'
});

// Virtual for estate maintenance requests
EstateSchema.virtual('maintenanceRequests', {
  ref: 'MaintenanceRequest',
  localField: '_id',
  foreignField: 'estate'
});

// Ensure virtual fields are serialized
EstateSchema.set('toJSON', { virtuals: true });
EstateSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Estate', EstateSchema); 