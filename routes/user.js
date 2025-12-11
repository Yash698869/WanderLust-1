// requiring this for express router method
const express = require("express");
const router = express.Router();

// importing User model
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

// signup drils
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });

      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    } catch (e) {
      // flash error message
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

// signin/login drils
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// Note-> paa.auto is a middliware used to authenticate the login details of user
router.post("/login", (req, res, next) => {
  console.log("Login POST hit", req.body);

  passport.authenticate("local", (err, user, info) => {
    console.log("Passport callback:", { err, user, info });

    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", info ? info.message : "Invalid credentials");
      return res.redirect("/login");  // stay on login with error
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome back!");
      res.redirect("/listings");  // go to listings on success
    });
  })(req, res, next);
});





// exporting router
module.exports = router;
