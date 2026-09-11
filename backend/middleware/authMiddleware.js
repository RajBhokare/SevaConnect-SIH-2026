const jwt = require('jsonwebtoken');
const store = require('../config/store');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'sevaconnect-sih-2026-secret-key-9988';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // 1. Check in-memory store
      let user = store.users.find(u => u._id === decoded.id || (u._id && u._id.toString() === decoded.id));
      
      // 2. Check MongoDB if not found in memory store
      if (!user) {
        try {
          const dbUser = await User.findById(decoded.id).lean();
          if (dbUser) {
            user = {
              _id: dbUser._id.toString(),
              name: dbUser.name,
              email: dbUser.email,
              phone: dbUser.phone,
              role: dbUser.role,
              location: dbUser.location
            };
            store.users.push(user);
          }
        } catch (dbErr) {
          // DB not connected or query failed, fallback to decoded payload
        }
      }

      // 3. If still not found, but token signature is valid, restore session automatically
      if (!user && decoded.id) {
        user = {
          _id: decoded.id,
          name: decoded.name || 'Cooperative Member',
          email: decoded.email || `${decoded.id}@sevaconnect.org`,
          phone: decoded.phone || '9876543210',
          role: decoded.role || 'CUSTOMER',
          location: decoded.location || 'Kothrud, Pune'
        };
        store.users.push(user);
      }

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
      console.error('[AuthMiddleware Error]:', error.message);
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
