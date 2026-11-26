import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/api/health', (_req, res) => res.json({ message: 'Civic Sync API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use((error, _req, res, _next) => res.status(400).json({ message: error.message || 'Something went wrong.' }));

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`))).catch(error => { console.error(error); process.exit(1); });
