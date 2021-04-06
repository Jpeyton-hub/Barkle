const router = require("express").Router();
const { response } = require("express");
const passport = require("passport");
//auth login
router.get("/login", (req, res) => {
  res.render("login");
});

//auth logout
router.get("/logout", (req, res) => {
  res.send("logging out");
});

//auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

//callback route for google to redirect to login
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    console.log(req, "this is something");
    res.render("profile");
  }
);
module.exports = router;
