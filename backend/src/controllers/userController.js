import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users (admins) for super admin
// @route   GET /api/users
// @access  Private/SuperAdmin
export const getUsers = async (req, res) => {
  try {
    const filter = req.user?.role === 'admin'
      ? { role: 'rider' }
      : { role: { $in: ['admin', 'rider'] } };

    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all riders
// @route   GET /api/users/riders
// @access  Private/Admin
export const getRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' }).select('-password');
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new admin or rider
// @route   POST /api/users
// @access  Private/SuperAdmin
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (req.user?.role === 'admin' && role && role !== 'rider') {
      return res.status(403).json({ message: 'Admins can only create riders' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: req.user?.role === 'admin' ? 'rider' : (role || 'admin'),
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/SuperAdmin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'superAdmin') {
        return res.status(400).json({ message: 'Cannot delete super admin' });
      }
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
