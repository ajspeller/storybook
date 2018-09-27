require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// passport config
require('./config/passport')(passport);

// load router
const authRoutes = require('./routes/auth');

const app = express();

app.get('/', (req, res) => {
  res.send('Index');
});

app.use('/auth', authRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});