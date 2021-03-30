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

  app.get("/eventforum/:eventname/:eventid", (req, res) => {
    db.posts
      .findAll({ where: { event_id: req.params.eventid } })
      // eslint-disable-next-line prettier/prettier
      .then(posts => res.render("eventForum", { posts: posts, eventid: req.params.eventid, eventname: req.params.eventname })
      );
  });
};
