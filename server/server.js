const express = require("express");
const passportConfig = require("./config/passportConfig");
const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const userRouter = require("./routes/userRouter");
const dogRouter = require("./routes/dogRouter");
const recipeRouter = require("./routes/recipeRouter");
const cors = require("cors");

const app = express();

// Configure passport and session
passportConfig(app);

const corsOptions = {
  origin: "http://localhost:9000",
  credentials: true, // to support session cookies
};

app.use(cors(corsOptions));

// Middleware to parse JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // console.log('Session ID:', req.sessionID);
  // console.log('Session Data:', req.session);
  // console.log('Authenticated:', req.isAuthenticated());
  next();
});

// API routes
app.use("/user", userRouter);
app.use("/dog", dogRouter);
app.use("/recipe", recipeRouter);

// set up nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USERNAME,
    subject: `New Contact Message from ${name}`,
    text: message,
    html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ message: "Error sending email", error });
    }
    res.status(200).send({ message: "Email successfully sent", info });
  });
});

// Endpoint to check auth status
app.get("/api/auth/check", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ isAuthenticated: true, user: req.user });
  } else {
    return res.json({ isAuthenticated: false });
  }
});

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
app.use(express.static(path.join(__dirname, "../dist")));

// Handling client-side routes in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.json({
    error:
      process.env.NODE_ENV === "production" ? "An error occurred" : err.message,
    stack: err.stack,
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}!!`);
});

module.exports = app;
