const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        console.log("error in finding");
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log("error in bcrypt");
          throw err;
        }
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password." });
        }
      });
    });
  })
);

module.exports = passport;
