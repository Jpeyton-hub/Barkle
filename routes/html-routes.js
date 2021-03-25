/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page

    res.render("home");
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.render("login");
    }
    res.render("signup");
  });

  app.get("/createProfile", (req, res) => {
    res.render("createProfile");
  });

  app.get("/dashboard", (req, res) => {
    res.render("dash");
  });

  app.get("/events", (req, res) => {
    res.render("event");
  });

  app.get("/signup", (req, res) => {
    res.render("signup");
  });

  app.get("/profile", (req, res) => {
    db.dogs
      .findAll({
        where: {
          owner_id: req.user.id
        }
      })

      .then(dogs => {
        console.log(dogs);
        res.render("profile", { dogs });
      });
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
};
