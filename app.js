require('dotenv').config();

const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');

// load models
require('./models/User');
require('./models/Story');

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

// handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

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

// set static folder
app.use(express.static(path.join(__dirname, 'public')));



// load router
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const storiesRoutes = require('./routes/stories');

app.use('/auth', authRoutes);
app.use('/', indexRoutes);
app.use('/stories', storiesRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});