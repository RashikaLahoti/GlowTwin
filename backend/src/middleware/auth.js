import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to enforce authentication on protected endpoints.
 * Expects Bearer token in the Authorization header.
 */
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      error: 'Not authorized, token missing',
      code: 'UNAUTHORIZED_MISSING_TOKEN',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'glowtwin_secret_access_key_123_abc_xyz');
    
    // Attach user to request, excluding password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        error: 'Not authorized, user not found',
        code: 'USER_NOT_FOUND',
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error(`[Auth Middleware] Token validation failed: ${error.message}`);
    return res.status(401).json({
      error: 'Not authorized, token invalid or expired',
      code: 'UNAUTHORIZED_INVALID_TOKEN',
    });
  }
};

/**
 * Middleware that extracts auth user if present, but does not block request if absent.
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'glowtwin_secret_access_key_123_abc_xyz');
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    // Silently continue as anonymous user
    console.warn(`[Auth Middleware] Optional token validation failed: ${error.message}`);
    next();
  }
};
