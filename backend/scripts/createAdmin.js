require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@blightdetect.com' });
    
    if (adminUser) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const newAdmin = new User({
      name: 'Admin',
      email: 'admin@blightdetect.com',
      password: 'admin123',
      role: 'admin'
    });

    await newAdmin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdminUser(); 