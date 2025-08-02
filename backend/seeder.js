const mongoose = require('mongoose');

// MongoDB connection string - hardcoded for now since env variables have issues
const MONGO_URI = 'mongodb+srv://admin:Admin123@estate.eebt4bf.mongodb.net/estatedb';

// Load models
const User = require('./models/User');
const Visitor = require('./models/Visitor');
const AccessLog = require('./models/AccessLog');
const EmergencyAlert = require('./models/EmergencyAlert');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const Notification = require('./models/Notification');

// Connect to DB
mongoose.connect(MONGO_URI);

// Sample data for seeding
const users = [
  {
    name: 'Ayomide Ajayi',
    userId: 'ayomide001',
    password: 'password123',
    apartment: '001',
    role: 'resident',
    profileImage: 'https://api.builder.io/api/v1/image/assets/TEMP/b33515045c777d0c286b60717fe7b167b8c5d1c9?placeholderIfAbsent=true&apiKey=ccca5fa523894231b7200d2f91b04a36',
  },
  {
    name: 'John Smith',
    userId: 'john002',
    password: 'password123',
    apartment: '002',
    role: 'resident'
  },
  {
    name: 'Sarah Johnson',
    userId: 'sarah003',
    password: 'password123',
    apartment: '003',
    role: 'resident'
  },
  {
    name: 'Security Officer',
    userId: 'security001',
    password: 'securitypassword',
    apartment: 'N/A',
    role: 'security'
  },
  {
    name: 'Maintenance Staff',
    userId: 'maintenance001',
    password: 'maintenancepassword',
    apartment: 'N/A',
    role: 'maintenance'
  }
];

// Import data into DB
const importData = async () => {
  try {
    await User.deleteMany();
    await Visitor.deleteMany();
    await AccessLog.deleteMany();
    await EmergencyAlert.deleteMany();
    await MaintenanceRequest.deleteMany();
    await Notification.deleteMany();

    // Create users
    const createdUsers = await User.create(users);
    
    const residentUser = createdUsers[0];
    const secondResident = createdUsers[1];
    const securityUser = createdUsers[3];
    const maintenanceUser = createdUsers[4];

    // Create some visitors for the first resident
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const visitor1 = await Visitor.create({
      name: 'James Brown',
      visitDate: today,
      visitTime: '14:00',
      resident: residentUser._id,
    });

    const visitor2 = await Visitor.create({
      name: 'Sarah Johnson',
      visitDate: tomorrow,
      visitTime: '10:00',
      resident: residentUser._id,
    });

    const visitor3 = await Visitor.create({
      name: 'Mike Wilson',
      visitDate: today,
      visitTime: '16:00',
      resident: secondResident._id,
    });

    // Create some emergency alerts
    const emergency1 = await EmergencyAlert.create({
      resident: residentUser._id,
      type: 'maintenance',
      priority: 'medium',
      description: 'Water leak in kitchen sink',
      location: 'Apartment 001, Kitchen',
      status: 'pending'
    });

    const emergency2 = await EmergencyAlert.create({
      resident: secondResident._id,
      type: 'security',
      priority: 'high',
      description: 'Suspicious person loitering in parking lot',
      location: 'Building A Parking Lot',
      status: 'acknowledged',
      assignedTo: securityUser._id
    });

    // Create some maintenance requests
    const maintenance1 = await MaintenanceRequest.create({
      resident: residentUser._id,
      category: 'plumbing',
      title: 'Leaky Faucet',
      description: 'Kitchen faucet is dripping constantly',
      location: 'Apartment 001, Kitchen',
      priority: 'medium',
      status: 'pending'
    });

    const maintenance2 = await MaintenanceRequest.create({
      resident: secondResident._id,
      category: 'electrical',
      title: 'Power Outlet Not Working',
      description: 'Living room outlet stopped working',
      location: 'Apartment 002, Living Room',
      priority: 'high',
      status: 'assigned',
      assignedTo: maintenanceUser._id
    });

    // Create some notifications
    await Notification.create([
      {
        recipient: securityUser._id,
        type: 'emergency',
        title: 'New Emergency Alert',
        message: 'Emergency reported by Ayomide Ajayi in Apartment 001',
        relatedEntity: emergency1._id,
        relatedEntityModel: 'EmergencyAlert',
        priority: 'medium'
      },
      {
        recipient: maintenanceUser._id,
        type: 'maintenance',
        title: 'New Maintenance Request',
        message: 'Maintenance request from Ayomide Ajayi: Leaky Faucet',
        relatedEntity: maintenance1._id,
        relatedEntityModel: 'MaintenanceRequest',
        priority: 'medium'
      },
      {
        recipient: residentUser._id,
        type: 'visitor',
        title: 'Visitor Access Granted',
        message: 'James Brown has been granted access to the building',
        relatedEntity: visitor1._id,
        relatedEntityModel: 'Visitor',
        priority: 'low'
      }
    ]);

    console.log('✅ Data Imported Successfully!');
    console.log(`📊 Created ${createdUsers.length} users`);
    console.log(`👥 Created ${3} visitors`);
    console.log(`🚨 Created ${2} emergency alerts`);
    console.log(`🔧 Created ${2} maintenance requests`);
    console.log(`🔔 Created ${3} notifications`);
    
    console.log('\n🧪 Test Credentials:');
    console.log('Resident: ayomide001 / password123');
    console.log('Security: security001 / securitypassword');
    console.log('Maintenance: maintenance001 / maintenancepassword');
    
    process.exit();
  } catch (err) {
    console.error('❌ Error importing data:', err);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Visitor.deleteMany();
    await AccessLog.deleteMany();
    await EmergencyAlert.deleteMany();
    await MaintenanceRequest.deleteMany();
    await Notification.deleteMany();

    console.log('🗑️ Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error('❌ Error destroying data:', err);
    process.exit(1);
  }
};

// Determine command line argument
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
} 