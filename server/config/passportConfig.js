const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../database/dbConfig');
const { userModel } = require('../models/userModel')
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
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!result.rows[0]) {
          return done(null, false); // No user found
        }
  
        const matched = await bcrypt.compare(password, result.rows[0].password);
        if (matched) {
          return done(null, result.rows[0]); // Successful login
        } else {
          return done(null, false); // Passwords do not match
        }
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    console.log("serializeUser called");
      done(null, user.id);
    });
    
    passport.deserializeUser(async (id, done) => {
      console.log("deserializeUser called"); 
        try {
          const user = await userModel.getUserById(id);
          done(null, user);
        } catch (err) {
          done(err);
        }
      });
};

module.exports = configurePassport;
