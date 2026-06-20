class RateLimiter {
  constructor() {
    this.store = new Map();
  }

  check(key, maxRequests, windowMs) {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (entry.count < maxRequests) {
      entry.count++;
      return true;
    }

    return false;
  }
}

const rateLimiter = new RateLimiter();

/**
 * Express middleware to rate limit endpoints.
 */
export const withRateLimit = (maxRequests, windowMs) => {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    const route = req.originalUrl || req.url;
    const key = `${route}:${ip}`;

    if (!rateLimiter.check(key, maxRequests, windowMs)) {
      console.warn(`[Rate Limiter] Rate limit exceeded for ${key}`);
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        code: 'RATE_LIMITED',
      });
    }

    next();
  };
};
