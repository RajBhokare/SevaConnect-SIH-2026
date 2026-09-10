const jwt = require('jsonwebtoken');
const store = require('../config/store');

const JWT_SECRET = process.env.JWT_SECRET || 'sevaconnect-sih-2026-secret-key-9988';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Find user from memory store or DB
      const user = store.users.find(u => u._id === decoded.id || (u._id && u._id.toString() === decoded.id));
      if (!user) {
        return res.status(401).json({ message: 'User not found or authorization revoked.' });
      }

      req.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location
      };
      
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid or expired token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: `Access denied. Requires ${role} role.` });
    }
    next();
  };
};

module.exports = { protect, requireRole, JWT_SECRET };
