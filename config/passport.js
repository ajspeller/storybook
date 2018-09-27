const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('mongoose');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);
    })
  );
};