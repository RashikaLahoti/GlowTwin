import Booking from '../models/Booking.js';
import Analysis from '../models/Analysis.js';

/**
 * @desc    Save a salon booking
 * @route   POST /api/bookings
 */
export const saveBooking = async (req, res, next) => {
  const { analysisId, salon, date, time } = req.body;

  try {
    if (!analysisId || !salon || !date || !time) {
      return res.status(400).json({
        error: 'analysisId, salon, date, and time are required.',
        code: 'MISSING_FIELDS',
      });
    }

    // Verify parent analysis exists
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
      return res.status(404).json({
        error: 'Associated analysis not found.',
        code: 'ANALYSIS_NOT_FOUND',
      });
    }

    // Attach authenticated user ID if present (optional auth)
    const userId = req.user ? req.user._id : undefined;

    const booking = await Booking.create({
      analysisId,
      userId,
      salon,
      date,
      time,
      stylistBriefSent: true, // Stylist brief sent automatically in MVP
    });

    console.log(`[Booking Controller] Booking ${booking._id} saved for analysis ${analysisId}`);
    
    res.status(200).json({
      bookingId: booking._id,
      message: 'Booking confirmed.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user bookings
 * @route   GET /api/bookings
 */
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('analysisId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
