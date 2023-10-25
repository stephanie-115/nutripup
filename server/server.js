require('dotenv').config();
const path = require('path');
const express = require('express');
const passportConfig = require('./config/passportConfig');
const userRouter = require('./routes/userRouter');
const dogRouter = require('./routes/dogRouter');
const recipeRouter = require('./routes/recipeRouter');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config');

const app = express();
const compiler = webpack(webpackConfig);

// Configure passport and session
passportConfig(app);

// Use middleware for webpack
if (process.env.NODE_ENV === 'development') {
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}

// Use hot middleware
app.use(webpackHotMiddleware(compiler));

const port = 3000;

//middleware to parse json & url-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes:
app.use('/user', userRouter);
app.use('/dog', dogRouter);
//app.use('/recipe', recipeRouter);

///serve main index.html file
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
});  

//serve css & js assets
app.get('/css/style.css', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../src/index.css'));
});
app.get('/js/index.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../src/index.js'));
});

// 404 error handling
app.use('*', (req, res) => {
  res.status(404).json({ error: 'This page does not exist' });
});

//general error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.json({ error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message, stack: err.stack });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!!`);
});

module.exports = app;
