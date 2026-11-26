import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const makeToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    if (await User.findOne({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name, email, phone, password: await bcrypt.hash(password, 12), role: 'citizen' });
    res.status(201).json({ token: makeToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password.' });
    res.json({ token: makeToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/me', protect, (req, res) => res.json({ user: req.user }));
export default router;
