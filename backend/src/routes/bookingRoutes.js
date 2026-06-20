import express from 'express';
import { saveBooking, getUserBookings } from '../controllers/bookingController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, saveBooking);
router.get('/', protect, getUserBookings);

export default router;
