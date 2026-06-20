/**
 * Global error handling middleware.
 */
export const errorHandler = (err, req, res, next) => {
  const message = err.message || 'Internal server error';
  const statusCode = err.statusCode || 500;
  
  console.error(`[Error Middleware] [${req.method}] ${req.originalUrl}:`, err);
  
  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
