const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'My_Secret',
    { expiresIn: '1d' }
  );
};