const mongoose = require('mongoose');

// MongoDB connection string - hardcoded for testing
const MONGO_URI = 'mongodb+srv://admin:Admin123@estate.eebt4bf.mongodb.net/estatedb';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Create a simple test document
    const testSchema = new mongoose.Schema({
      name: String,
      date: { type: Date, default: Date.now }
    });
    
    const Test = mongoose.model('Test', testSchema);
    
    const testDoc = await Test.create({ name: 'Connection Test' });
    console.log('Test document created:', testDoc);
    
    // Clean up
    await Test.deleteMany({});
    console.log('Test documents cleaned up');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed successfully');
    
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
}

testConnection(); 