import express from 'express';
import { register, login, googleMock, refresh, logout } from '../controllers/authController.js';
import { withRateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

// Apply a rate limit of 15 requests per minute for sensitive auth routes
const authRateLimit = withRateLimit(15, 60000);

router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);
router.post('/google-mock', googleMock); // Mock login bypasses heavy limit to ensure smooth UI demos
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
