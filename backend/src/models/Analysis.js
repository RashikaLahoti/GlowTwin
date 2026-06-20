import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  selfieUrl: {
    type: String,
    required: true,
  },
  inspirationUrl: {
    type: String,
    required: true,
  },
  selfiePublicId: {
    type: String,
    default: '',
  },
  inspoPublicId: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: 'India',
  },
  budget: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'complete', 'error'],
    default: 'pending',
    index: true,
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
  },
  errorMessage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

export default mongoose.model('Analysis', AnalysisSchema);
