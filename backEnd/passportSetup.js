const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const models = require('./models');

module.exports = app => {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      models.user.findOne({username: username}, (err, user) => {
        if (err) return console.error(err);
        // user will return null if username does not exist in DB
        if (!user) {
          return done(null, "", {message: 'Incorrect Username'});
        }
        if (!user.validPassword(password, user)) {
          return done(null, "", { message: 'Incorrect Password.' });
        }
        return done(null, user);
      });
    }
  ));
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  
  app.use(session({ secret: process.env.SECRET }));
  app.use(passport.initialize());
  app.use(passport.session());
}