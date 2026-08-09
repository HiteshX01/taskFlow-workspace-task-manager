import express from 'express';
import { renderLogin, renderRegister, renderResetPassword, handleRegister, handleLogin, handleResetPassword, handleVerifyOtp, handleLogout } from '../controllers/authController.js';
import { isGuest } from '../middleware/auth.js';

const router = express.Router();

// for the uptime robot 
router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Guest routes (redirects to dashboard if already logged in)
router.get('/login', isGuest, renderLogin);
router.post('/login', handleLogin);

router.get('/resetPassword', renderResetPassword);
router.post('/forgot-password', handleResetPassword);
router.post('/reset-password', handleVerifyOtp);
router.post('/verify-otp', handleVerifyOtp);

router.get('/register', renderRegister);
router.post('/register', handleRegister);

// Logout route
router.get('/logout', handleLogout);

export default router;
