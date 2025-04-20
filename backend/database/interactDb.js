const { User, Freelancer, Client } = require('../models/UserModel');
const bcrypt = require('bcrypt');

async function registerUser({ email, password, role }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }
  console.log(password.length,"adassda"
  )
  
  

  const newUser = new User({
    email,
    password: password,
    role,
  });
  await newUser.save();

  if (role === 'freelancer') {
    const freelancer = new Freelancer({ user: newUser._id });
    await freelancer.save();
  } else if (role === 'client') {
    const client = new Client({ user: newUser._id });
    await client.save();
  }

  return {
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
  };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const isMatch =await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return user;
}

module.exports = {
  registerUser,
  loginUser,
};