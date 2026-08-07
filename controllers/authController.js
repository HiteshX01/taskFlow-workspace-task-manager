import bcrypt from 'bcryptjs';
import { userModel } from '../models/user.js';
import { otpModel } from '../models/otp.js';
import crypto from "crypto";
import { sendOtpEmail } from '../services/email.service.js';

export const renderLogin = (req, res) => {
  res.render('login', { error: null });
};

export const renderRegister = (req, res) => {
  res.render('register', { error: null });
};

export const renderResetPassword = (req, res) => {
  res.render('resetPassword', { error: null });
}

export const handleRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.render('register', { error: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.render('register', { error: 'Password must be at least 6 characters long.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render('register', { error: 'Please enter a valid email address (e.g. name@domain.com).' });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }]
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return res.render('register', { error: 'Email address is already registered.' });
      }
      return res.render('register', { error: 'Username is already taken.' });
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userModel.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Set user session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Registration Error:', error);

    // Duplicate key error (E11000)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0] || 'Username or Email';
      return res.render('register', { error: `That ${duplicateField} is already registered.` });
    }

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]?.message || 'Validation failed.';
      return res.render('register', { error: firstError });
    }

    return res.render('register', { error: 'Registration failed. Please ensure MongoDB is running and try again.' });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.render('login', { error: 'Please fill in all fields.' });
    }

    // Find user by email or username
    const user = await userModel.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase().trim() },
        { username: emailOrUsername.trim() }
      ]
    });

    if (!user) {
      return res.render('login', { error: 'Invalid email/username or password.' });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email/username or password.' });
    }

    // Create session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Login Error:', error);
    return res.render('login', { error: 'An error occurred during login. Please try again.' });
  }
};

export const handleResetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.render('resetPassword', { error: 'Please enter an email address.' });
    }

    const user = await userModel.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!user) {
      return res.render('resetPassword', { error: 'Invalid email.' });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const userId = user._id;
    
    const saltRounds = 5;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    await otpModel.create({
      otpHash: hashedOtp,
      userId: userId
    });

    await sendOtpEmail(user.email, otp);  
    return res.render('resetPassword', { error: 'OTP sent successfully! Please check your email.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.render('resetPassword', { error: 'Failed to send OTP email: ' + (error.message || 'Unknown error') });
  }
}

export const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
};
