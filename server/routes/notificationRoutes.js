import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.use(protect);
router.get('/', async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).populate('report', 'title').sort({ createdAt: -1 });
  res.json({ notifications });
});
router.patch('/:id/read', async (req, res) => {
  const item = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true }, { new: true });
  if (!item) return res.status(404).json({ message: 'Notification not found.' });
  res.json({ notification: item });
});
export default router;
