import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  address: { type: String, required: true, trim: true },
  ward: { type: String, trim: true },
  photos: [String],
  completionPhoto: String,
  status: { type: String, enum: ['Received', 'In progress', 'Resolved'], default: 'Received' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timeline: [{ status: String, note: String, changedAt: { type: Date, default: Date.now } }]
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
