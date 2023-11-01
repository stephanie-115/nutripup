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
  },

  // setTestUser(req, res, next) {
  //   req.user = { id: 1 };
  //   next();
  // }
  
};

module.exports = auth;
