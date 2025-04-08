exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate field value entered'
      });
    }
  
    //validation error for mongoose
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages
      });
    }
  
    //jwt errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
  
    //default server error
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  };