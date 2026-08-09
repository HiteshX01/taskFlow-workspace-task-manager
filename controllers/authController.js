import bcrypt from 'bcryptjs';
import { userModel } from '../models/user.js';
import { otpModel } from '../models/otp.js';
import crypto from "crypto";
import { sendOtpEmail } from '../services/email.service.js';

export const renderLogin = (req, res) => {
  res.render('login', { error: null, success: null });
};

export const renderRegister = (req, res) => {
  res.render('register', { error: null });
};

export const renderResetPassword = (req, res) => {
  res.render('resetPassword', { error: null, success: null, step: 1, email: '' });
};

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
      return res.render('resetPassword', { error: 'Please enter an email address.', success: null, step: 1, email: '' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.render('resetPassword', { error: 'No user found with this email address.', success: null, step: 1, email: normalizedEmail });
    }

    // Clear existing OTPs for this user
    await otpModel.deleteMany({ userId: user._id });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    await otpModel.create({
      otpHash: hashedOtp,
      userId: user._id
    });

    await sendOtpEmail(user.email, otp);  

    return res.render('resetPassword', {
      error: null,
      success: 'OTP sent successfully! Please check your email.',
      step: 2,
      email: normalizedEmail
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.render('resetPassword', {
      error: 'Failed to send OTP email: ' + (error.message || 'Unknown error'),
      success: null,
      step: 1,
      email: req.body.email || ''
    });
  }
};

export const handleVerifyOtp = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      return res.render('resetPassword', {
        error: 'All fields are required.',
        success: null,
        step: 2,
        email: email || ''
      });
    }

    if (password !== confirmPassword) {
      return res.render('resetPassword', {
        error: 'Passwords do not match.',
        success: null,
        step: 2,
        email: email
      });
    }

    if (password.length < 6) {
      return res.render('resetPassword', {
        error: 'Password must be at least 6 characters long.',
        success: null,
        step: 2,
        email: email
      });
    }

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.render('resetPassword', {
        error: 'User account not found.',
        success: null,
        step: 1,
        email: ''
      });
    }

    // Find latest OTP for this user
    const otpRecord = await otpModel.findOne({ userId: user._id }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.render('resetPassword', {
        error: 'OTP has expired or is invalid. Please request a new OTP.',
        success: null,
        step: 2,
        email: user.email
      });
    }

    // Verify OTP code
    const isMatch = await bcrypt.compare(otp.trim(), otpRecord.otpHash);
    if (!isMatch) {
      return res.render('resetPassword', {
        error: 'Invalid OTP. Please check the code and try again.',
        success: null,
        step: 2,
        email: user.email
      });
    }

    // Hash new password & save to user document
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();

    // Delete used OTP
    await otpModel.deleteMany({ userId: user._id });

    // Render login with success alert
    return res.render('login', {
      error: null,
      success: 'Password reset successfully! Please log in with your new password.'
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.render('resetPassword', {
      error: 'An error occurred while resetting password: ' + (error.message || 'Unknown error'),
      success: null,
      step: 2,
      email: req.body.email || ''
    });
  }
};

export const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
};
