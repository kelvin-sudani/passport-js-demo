const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/", (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      //return next(err);
      return res.status(400).json({ errors: err });
    }
    if (!user) {
      return res.status(400).json({ errors: "No user found" });
      //return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(400).json({ errors: err });
      }
      return res.status(200).json({ success: `logged in ${user.username}` });
    });
  })(req, res, next);
});

module.exports = router;
