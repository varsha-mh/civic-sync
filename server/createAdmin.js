import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';

await connectDB();
const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env');
const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
if (existing) {
  existing.role = 'admin';
  existing.name = ADMIN_NAME;
  existing.password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await existing.save();
  console.log('Existing account updated as admin.');
} else {
  await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: await bcrypt.hash(ADMIN_PASSWORD, 12), role: 'admin' });
  console.log('Admin account created.');
}
process.exit(0);
