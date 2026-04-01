import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import connectDB from '../config/db.js';

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const createSuperAdmin = async () => {
  try {
    // Default credentials for the super admin
    const email = process.argv[2] || 'superadmin@example.com';
    const password = process.argv[3] || 'admin123456';
    const name = 'System Owner';

    console.log(`Checking if user ${email} exists...`);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('User already exists! Ensure the role is superAdmin.');
      if (existingUser.role !== 'superAdmin') {
        existingUser.role = 'superAdmin';
        await existingUser.save();
        console.log(`Updated existing user ${email} to be a superAdmin.`);
      }
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const superAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'superAdmin',
    });

    console.log('\n✅ Super Admin created successfully!');
    console.log('------------------------------------------------');
    console.log(`Name:     ${superAdmin.name}`);
    console.log(`Email:    ${superAdmin.email}`);
    console.log(`Password: ${password}`);
    console.log('------------------------------------------------');
    console.log('Please log in and change your password if deploying to production.\n');
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error creating super admin: ${error.message}`);
    process.exit(1);
  }
};

createSuperAdmin();
