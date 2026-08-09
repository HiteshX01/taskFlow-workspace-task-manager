import express from 'express';
import { renderLogin, renderRegister, renderResetPassword, handleRegister, handleLogin, handleResetPassword, handleVerifyOtp, handleLogout } from '../controllers/authController.js';
import { isGuest } from '../middleware/auth.js';

const router = express.Router();

// Guest routes (redirects to dashboard if already logged in)
router.get('/login', isGuest, renderLogin);
router.post('/login', isGuest, handleLogin);

router.get('/resetPassword', renderResetPassword);
router.post('/forgot-password', handleResetPassword);
router.post('/reset-password', handleVerifyOtp);
router.post('/verify-otp', handleVerifyOtp);

router.get('/register', isGuest, renderRegister);
router.post('/register', isGuest, handleRegister);

// Logout route
router.get('/logout', handleLogout);

export default router;
