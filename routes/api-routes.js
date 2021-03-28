/* eslint-disable camelcase */
// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    if (!req.user) {
      res.redirect("/signup");
    } else {
      res.redirect("/profile");
    }
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      userName: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
      .then(user => {
        req.login(user, err => {
          if (err) {
            return next(err);
          }
        });
        res.redirect("/createProfile");
      })
      .catch(err => {
        res.status(401).json(err);
        console.log(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // Route for adding a new dog to db
  app.post("/api/adddog", (req, res) => {
    db.dogs
      .create({
        name: req.body.name,
        breed: req.body.breed,
        outgoing: req.body.outgoing,
        fav_activity: req.body.fav,
        owner_id: req.user.id
      })
      .then(res.redirect("/profile"));
  });

  // Route for adding a new event to db
  app.post("/api/addevents", (req, res) => {
    if (req.user) {
      db.events
        .create({
          name: req.body.name,
          date: req.body.date,
          time: req.body.time,
          event_description: req.body.event_description,
          location_id: req.body.location_id,
          user_id: req.user.id,
          dogs_id: req.body.dogs
        })
        .then(res.redirect("/dashboard"))
        .catch(() => {
          // res.json({ message: "Make sure you are logged in" });
        });
    } else {
      res.redirect("/login");
    }
  });

  // Route to see all events or a specific one
  app.get("/api/dash/:eventname?", (req, res) => {
    if (req.params.eventname) {
      // eslint-disable-next-line prettier/prettier
      db.events.findAll({ where: { name: req.params.eventname } }).then(events => res.render("dash", { events }));
    } else {
      db.events.findall().then(events => res.render("dash", { events }));
    }
  });

  // Route to delete events
  app.get("/api/delete/:eventid", (req, res) => {
    if (req.user.id === req.body.id) {
      db.events
        .destroy({ where: { id: req.params.eventid } })
        .then(res.redirect("/dashboard"));
    } else {
      res.send("YOU MUST BE THE EVENT OWNER IN ORDER TO DELETE");
    }
  });

  // Route to add new posts
  app.post("/api/addpost/:eventid", (req, res) => {
    db.posts
      .create({
        poster_id: req.user.id,
        poster_name: req.user.userName,
        event_id: req.params.eventid,
        content: req.body.content
      })
      .then(post => res.redirect("/eventforum/" + post.event_id));
  });
};
