const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerUser,loginUser } = require('../database/interactDb');
require('dotenv').config();

const signup = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await registerUser({ email, password: hashedPassword, role });

    const token = jwt.sign({ id: user.id,
       email, role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(400).json({ message: error.message });  }
};
const login = async (req, res) => {
  try {
    const user = await loginUser(req.body);
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ user, token });
  } catch (err) {
    const status = err.message === 'User not found' || err.message === 'Invalid credentials' ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};
module.exports = { signup,login };
