import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/error.js';

// Load routes
import authRoutes from './routes/authRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    const isAllowed = ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development';
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed by GlowTwin server'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Support larger base64 images if passed direct
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handling Middleware (must be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[GlowTwin Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
export { server };
