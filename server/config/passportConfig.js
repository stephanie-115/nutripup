const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const authService = require('../services/authService');

const configurePassport = (app) => {
  // Session config
  app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use 'true' in production
        sameSite: 'lax'
    }
  }));

  // Passport config
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
      async (username, password, done) => {
        try {
          const user = await authService.authenticateUser(username, password);
          if (!user) return done(null, false);

          return done(null, user);
        } catch (err){
          return done(err)
        }
      }
  ));

  passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
          const user = await userModel.getUserById(id);
          done(null, user);
        } catch (err) {
          done(err);
        }
      });
};

module.exports = configurePassport;
