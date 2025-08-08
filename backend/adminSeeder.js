const mongoose = require('mongoose');
const Admin = require('./models/Admin');

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://admin:Admin123@estate.eebt4bf.mongodb.net/estatedb';

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

const createSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ username: 'superadmin' });
    
    if (existingAdmin) {
      console.log('Super admin already exists');
      return;
    }

    // Create super admin
    const superAdmin = await Admin.create({
      username: 'superadmin',
      password: 'admin123',
      name: 'Super Administrator',
      email: 'admin@estatemanage.com',
      role: 'super_admin',
      permissions: {
        estates: {
          create: true,
          read: true,
          update: true,
          delete: true
        },
        users: {
          create: true,
          read: true,
          update: true,
          delete: true
        },
        security: {
          create: true,
          read: true,
          update: true,
          delete: true
        },
        reports: {
          read: true,
          export: true
        }
      }
    });

    console.log('Super admin created successfully:');
    console.log('Username: superadmin');
    console.log('Password: admin123');
    console.log('Email: admin@estatemanage.com');
    console.log('Role: super_admin');

  } catch (error) {
    console.error('Error creating super admin:', error);
  }
};

const createDefaultAdmin = async () => {
  try {
    // Check if default admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Default admin already exists');
      return;
    }

    // Create default admin
    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123',
      name: 'Administrator',
      email: 'admin@estate.com',
      role: 'admin',
      permissions: {
        estates: {
          create: true,
          read: true,
          update: true,
          delete: false
        },
        users: {
          create: true,
          read: true,
          update: true,
          delete: false
        },
        security: {
          create: true,
          read: true,
          update: true,
          delete: false
        },
        reports: {
          read: true,
          export: false
        }
      }
    });

    console.log('Default admin created successfully:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@estate.com');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

const seedAdmins = async () => {
  await connectDB();
  
  console.log('Creating admin users...');
  
  await createSuperAdmin();
  await createDefaultAdmin();
  
  console.log('Admin seeding completed!');
  
  // Close connection
  mongoose.connection.close();
};

// Run seeder
seedAdmins().catch(console.error); 