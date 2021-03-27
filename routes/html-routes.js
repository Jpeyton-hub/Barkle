/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page

    res.render("home");
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    res.render("login");
  });

  app.get("/createProfile", (req, res) => {
    res.render("createProfile");
  });

  app.get("/dashboard", (req, res) => {
    db.events
      .findAll({ where: { date: { [Op.gte]: moment().toDate() } } })
      .then(events => {
        console.log(events);

        res.render("dash", {
          events: events.map(event => {
            return req.user.id === event.dataValues.user_id
              ? { ...event, owner: true }
              : { ...event, owner: false };
          })
        });
      });
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
      })
      .catch(() => {
        res.redirect("/createProfile");
      });
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
};
