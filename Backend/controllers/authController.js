const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required: name, email, password, role' });
    }

    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const user = await User.create({ name, email: email.toLowerCase(), password, role });
    const token = signToken(user.id);

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    let user = await User.findOne({ where: { email: email.toLowerCase() } });
    
    // Auto-register for demo purposes if user doesn't exist
    if (!user) {
       user = await User.create({ 
         name: email.split('@')[0], 
         email: email.toLowerCase(), 
         password, 
         role: role || 'Fleet Manager' 
       });
    } else {
       // For demo/hackathon: just update their password and role to whatever they typed!
       user.password = password;
       if (role) {
         user.role = role;
       }
       await user.save();
    }

    const token = signToken(user.id);

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      id: user.id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
