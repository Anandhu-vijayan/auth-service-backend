// src/middlewares/errorMiddleware.js

export default (err, req, res, next) => {
  console.error(err.stack); // Log full error stack to console for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
