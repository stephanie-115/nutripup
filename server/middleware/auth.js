const auth = {
  isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    // If not authenticated, send back to login page
    return res.redirect('/sign-in');
  },

  redirectIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/');  
    }
    return next();
  }
};

module.exports = auth;
