import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superAdmin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const rider = (req, res, next) => {
  if (req.user && req.user.role === 'rider') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a rider' });
  }
};

const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superAdmin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a super admin' });
  }
};

const adminOrRider = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superAdmin' || req.user.role === 'rider')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized for this operation' });
  }
};

export { protect, admin, rider, superAdmin, adminOrRider };
