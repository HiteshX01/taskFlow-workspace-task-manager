// Middleware to protect routes that require authentication
export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    // Attach user session object to res.locals for EJS views
    res.locals.user = req.session.user;
    return next();
  }
  
  // If not logged in, redirect to login page
  return res.redirect('/login');
};

// Middleware to redirect logged-in users away from login/register pages
export const isGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  return next();
};
