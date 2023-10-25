const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('./models/userModel');
const authService = require('./services/authService');

// Session config
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
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