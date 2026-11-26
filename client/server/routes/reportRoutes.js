import express from 'express';
import Report from '../models/Report.js';
import Notification from '../models/Notification.js';
import { protect, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();
router.use(protect);
const publicReport = report => report;

router.post('/', upload.array('photos', 3), async (req, res) => {
  try {
    const { title, description, category, address, ward } = req.body;
    if (!title || !description || !category || !address) return res.status(400).json({ message: 'Please complete all required fields.' });
    const photos = (req.files || []).map(file => `/uploads/${file.filename}`);
    const report = await Report.create({ title, description, category, address, ward, photos, citizen: req.user._id, timeline: [{ status: 'Received', note: 'Report submitted' }] });
    res.status(201).json({ report: publicReport(report) });
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.get('/mine', async (req, res) => {
  const reports = await Report.find({ citizen: req.user._id }).sort({ createdAt: -1 });
  res.json({ reports });
});

router.get('/admin/all', adminOnly, async (req, res) => {
  const { status, category, ward, search } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.status = status;
  if (category && category !== 'All') filter.category = category;
  if (ward) filter.ward = new RegExp(ward, 'i');
  if (search) filter.title = new RegExp(search, 'i');
  const reports = await Report.find(filter).populate('citizen', 'name email').sort({ createdAt: -1 });
  res.json({ reports });
});

router.get('/admin/stats', adminOnly, async (_req, res) => {
  const [total, received, progress, resolved, categories] = await Promise.all([
    Report.countDocuments(), Report.countDocuments({ status: 'Received' }), Report.countDocuments({ status: 'In progress' }), Report.countDocuments({ status: 'Resolved' }), Report.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }])
  ]);
  res.json({ total, received, progress, resolved, categories });
});

router.get('/:id', async (req, res) => {
  const report = await Report.findById(req.params.id).populate('citizen', 'name email');
  if (!report) return res.status(404).json({ message: 'Report not found.' });
  if (req.user.role !== 'admin' && String(report.citizen._id) !== String(req.user._id)) return res.status(403).json({ message: 'You cannot view this report.' });
  res.json({ report });
});

router.patch('/:id/status', adminOnly, upload.single('completionPhoto'), async (req, res) => {
  try {
    const { status, priority, note } = req.body;
    if (!['Received', 'In progress', 'Resolved'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    if (status === 'Resolved' && !report.completionPhoto && !req.file) return res.status(400).json({ message: 'Upload a completion photo before resolving this report.' });
    if (req.file) report.completionPhoto = `/uploads/${req.file.filename}`;
    report.status = status;
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) report.priority = priority;
    report.timeline.push({ status, note: note || `Status updated to ${status}` });
    await report.save();
    await Notification.create({ user: report.citizen, report: report._id, message: `Your report “${report.title}” is now ${status}.` });
    res.json({ report });
  } catch (error) { res.status(400).json({ message: error.message }); }
});
export default router;
