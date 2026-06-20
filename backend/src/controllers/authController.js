import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate access token
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET || 'glowtwin_secret_access_key_123_abc_xyz',
    { expiresIn: '15m' }
  );
};

// Helper to generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'glowtwin_secret_refresh_key_123_abc_xyz',
    { expiresIn: '7d' }
  );
};

// Send response helper setting HttpOnly cookie for refresh token
const sendTokensResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(statusCode).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
    },
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
export const register = async (req, res, next) => {
  const { email, password, displayName } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required', code: 'MISSING_FIELDS' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists', code: 'USER_EXISTS' });
    }

    const user = await User.create({
      email,
      password,
      displayName,
    });

    sendTokensResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log in user
 * @route   POST /api/auth/login
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required', code: 'MISSING_FIELDS' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
    }

    sendTokensResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bridge frontend Mock Google Sign-In
 *          Creates or signs in a default mock account.
 * @route   POST /api/auth/google-mock
 */
export const googleMock = async (req, res, next) => {
  const email = 'google-mock-user@glowtwin.com';
  const displayName = 'Google Demo User';

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create user with a randomized secure password placeholder since they auth via mock provider
      const randomPassword = Math.random().toString(36).substring(2) + Date.now().toString(36);
      user = await User.create({
        email,
        password: randomPassword,
        displayName,
      });
      console.log(`[Auth Controller] Created mock Google user: ${email}`);
    }

    sendTokensResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh expired access token
 * @route   POST /api/auth/refresh
 */
export const refresh = async (req, res, next) => {
  // Read token from cookie first, fallback to request body
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    return res.status(401).json({ error: 'Refresh token missing', code: 'MISSING_REFRESH_TOKEN' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'glowtwin_secret_refresh_key_123_abc_xyz');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User associated with token not found', code: 'USER_NOT_FOUND' });
    }

    const accessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error(`[Auth Controller] Refresh token validation error: ${error.message}`);
    return res.status(401).json({ error: 'Invalid or expired refresh token', code: 'INVALID_REFRESH_TOKEN' });
  }
};

/**
 * @desc    Log out user / Clear cookie
 * @route   POST /api/auth/logout
 */
export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
