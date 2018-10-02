const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('mongoose');

// load User model
const User = mongoose.model('user');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      // console.log(profile);
      const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));

      const newUser = {
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        image
      };

      // check for existing user
      User.findOne({
          googleID: newUser.googleID
        })
        .then(user => {
          if (user) {
            // existing user
            done(null, user);
          } else {
            // create user
            new User(newUser)
              .save()
              .then(user => {
                done(null, user);
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });

};