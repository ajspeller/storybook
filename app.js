require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// load User model
require('./models/User');

// passport config
require('./config/passport')(passport);


// mongoose connect
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log(`Database connection successful!`)
  })
  .catch(err => {
    console.log(err);
  });

const app = express();

app.use(cookieParser());

// express session
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));


// passport middleware, has to be after express session
app.use(passport.initialize());
app.use(passport.session());

// set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});


// index route
app.get('/', (req, res) => {
  res.send('Index');
});


// load router
const authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});