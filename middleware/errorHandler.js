export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate entry found',
        error: Object.keys(err.keyValue).map(key => `${key} already exists`).join(', ')
      });
    }
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        error: Object.values(err.errors).map(error => error.message).join(', ')
      });
    }
  
    // JWT authentication error
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token',
        error: 'Authentication failed'
      });
    }
  
    // Default error
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  };