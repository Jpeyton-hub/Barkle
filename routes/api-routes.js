/* eslint-disable camelcase */
// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post(
    "/api/login",
    passport.authenticate("local", { failureRedirect: "/error" }),
    (req, res) => {
      // Sending back a password, even a hashed password, isn't a good idea
      if (!req.user) {
        res.redirect("/signup");
      } else {
        res.redirect("/profile");
      }
    }
  );

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
        console.log(err);
        res.status(401).redirect("/error");
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
          creator: req.user.userName,
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

  // Route to filter events by creator
  app.post("/api/eventcreatorsearch/", (req, res) => {
    db.events.findAll({ where: { creator: req.body.creator } }).then(events => {
      res.render("dash", {
        events: events.map(event => {
          return req.user.id === event.dataValues.user_id
            ? { ...event, owner: true }
            : { ...event, owner: false };
        })
      });
    });
  });

  // Route to filter events by date
  app.post("/api/eventdatesearch/", (req, res) => {
    console.log(req.body);
    db.events.findAll({ where: { date: req.body.date } }).then(events => {
      res.render("dash", {
        events: events.map(event => {
          return req.user.id === event.dataValues.user_id
            ? { ...event, owner: true }
            : { ...event, owner: false };
        })
      });
    });
  });

  // Route to delete events
  app.get("/api/delete/:eventid", (req, res) => {
    db.events.findOne({ where: { id: req.params.eventid } }).then(data => {
      if (data.dataValues.user_id === req.user.id) {
        db.events
          .destroy({ where: { id: req.params.eventid } })
          .then(res.redirect("/dashboard"));
      }
    });
  });

  // Route to add new posts
  app.post("/api/addpost/:eventname/:eventid", (req, res) => {
    db.posts
      .create({
        poster_id: req.user.id,
        poster_name: req.user.userName,
        event_id: req.params.eventid,
        event_name: req.params.eventname,
        content: req.body.content
      })
      .then(post => {
        res.redirect(`/eventforum/${post.event_name}/${post.event_id}`);
      });
  });

  // Route to add likes to an event
  app.get("/api/likeevent/:eventid/:likes", (req, res) => {
    db.events
      .update(
        { likes: parseInt(req.params.likes) + 1 },
        {
          where: {
            id: req.params.eventid
          }
        }
      )
      .then(() => res.redirect("/dashboard"))
      .catch(err => console.log(err));
  });

  // Route to add likes to an post
  app.get("/api/likepost/:postid/:likes/:eventname/:eventid", (req, res) => {
    db.posts
      .update(
        { likes: parseInt(req.params.likes) + 1 },
        {
          where: {
            id: req.params.postid
          }
        }
      )
      .then(post => {
        console.log(post);
        res.redirect(
          `/eventforum/${req.params.eventname}/${req.params.eventid}`
        );
      })
      .catch(err => console.log(err));
  });
};
