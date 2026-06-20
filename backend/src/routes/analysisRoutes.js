import express from 'express';
import { analyze, getUserAnalyses, getAnalysisById } from '../controllers/analysisController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { withRateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

// Apply a rate limit of 5 requests per minute for analysis generation
const analysisRateLimit = withRateLimit(5, 60000);

router.post('/analyze', optionalAuth, analysisRateLimit, analyze);
router.get('/', protect, getUserAnalyses);
router.get('/:id', optionalAuth, getAnalysisById);

export default router;
