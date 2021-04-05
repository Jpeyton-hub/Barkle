const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20");

const db = require("../models");
// const User = require("../models/user");

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(
  new LocalStrategy(
    // Our user will sign in using an email, rather than a "username"
    {
      usernameField: "email"
    },
    (email, password, done) => {
      // When a user tries to sign in this code runs
      db.User.findOne({
        where: {
          email: email
        }
      }).then(dbUser => {
        // If there's no user with the given email
        console.log(dbUser);
        if (!dbUser) {
          return done(null, false, {
            message: "Incorrect email."
          });
        }
        // If there is a user with the given email, but the password the user gives us is incorrect
        else if (!dbUser.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        // If none of the above, return the user
        return done(null, dbUser);
      });
    }
  )
);

//google sign in strategy
passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID:
        "1052973621284-gnqhinj66h7mub9qc9lkjgan3ldkvp4l.apps.googleusercontent.com",
      clientSecret: "PDA5Gu-UiwaMb3clkX7Ws9Zi"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      //check if user exists in our db
      db.User.findOne({ where: { email: profile.emails[0].value } }).then(
        currentUser => {
          if (currentUser) {
            //already have the user
            console.log("user is: ", currentUser);
          } else {
            //if not create a new user in the db
            db.User.create({
              email: profile.emails[0].value,
              userName: profile.displayName
            }).then(newUser => {
              console.log("new user created: " + newUser);
            });
          }
        }
      );
    }
  )
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
