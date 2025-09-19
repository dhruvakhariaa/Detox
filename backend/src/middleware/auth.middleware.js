const jwt = require('jsonwebtoken');
const User = require('../models/User'); // We need access to the User model to find the user from the token payload

const protect = async (req, res, next) => {
  let token;

  // First, check if the request header contains an 'authorization' field that starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Extract the token from the header. The format is "Bearer <token>", so we split the string and take the second part.
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token. This function decodes the token and checks if it's valid (not expired, and signed with our secret).
      // It uses the JWT_SECRET from your .env file.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. If the token is valid, its payload will contain the user's ID. We use this ID to find the user in our database.
      // We use .select('-password') to ensure the user's password hash is never exposed in the application logic.
      req.user = await User.findById(decoded.id).select('-password');
      
      // If the user associated with the token no longer exists
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Not authorized, user not found' } });
      }

      // 4. If a user is found, we call next() to pass the request along to the next middleware or the final route handler.
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ error: { message: 'Not authorized, token failed' } });
    }
  }

  // If no token was found in the header at all
  if (!token) {
    return res.status(401).json({ error: { message: 'Not authorized, no token provided' } });
  }
};

module.exports = { protect };
