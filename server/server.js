const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const passportConfig = require('./config/passportConfig');
const userRouter = require('./routes/userRouter');
const dogRouter = require('./routes/dogRouter');
const recipeRouter = require('./routes/recipeRouter');
const cors = require('cors');
const session = require('express-session');

const app = express();

// Configure passport and session
passportConfig(app);

const corsOptions = {
  origin: 'http://localhost:9000', 
  credentials: true, // to support session cookies
};
app.use(cors(corsOptions));

// Middleware to parse JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/user', userRouter);
app.use('/dog', dogRouter);
app.use('/recipe', recipeRouter);

// Endpoint to check auth status
app.get('/api/auth/check', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ isAuthenticated: true, user: req.user });
  } else {
    return res.json({ isAuthenticated: false });
  }
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false }
}));

// For development environment
// if (process.env.NODE_ENV !== 'production') {
  // const webpack = require('webpack');
 //  const webpackDevMiddleware = require('webpack-dev-middleware');
  // const webpackHotMiddleware = require('webpack-hot-middleware');
  // const webpackConfig = require('../webpack.config');
  // const compiler = webpack(webpackConfig);

//   app.use(webpackDevMiddleware(compiler, {
//     publicPath: webpackConfig.output.publicPath,
//   }));
//   app.use(webpackHotMiddleware(compiler));
// }

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Handling client-side routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.json({ error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message, stack: err.stack });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}!!`);
});

module.exports = app;
