import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Built-in & Third-party Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'task-manager-dev-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 Hours
  }
}));

// Set EJS View Engine
app.set('view engine', 'ejs');

// Global Locals Middleware for EJS Templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Mount Routers
app.use('/', authRoutes);
app.use('/', taskRoutes);

// Default Route Redirect
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/login');
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).render('login', { error: '404 - Page not found.' });
});

app.listen(port, () => {
  console.log(`🚀 Task & Project Manager running at http://localhost:${port}`);
});