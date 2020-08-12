const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post("/", (req, res) => {
  User.findOne({ username: req.body.username }, async (error, user) => {
    if (error) {
      console.log("Error in SignUp: " + err);
      return done(err);
    }
    if (user) res.send("User Already Exists");
    const hashedPassword = await bcrypt.hash(req.body.password, 5);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    newUser
      .save()
      .then((user) => {
        return res.send("User Created");
      })
      .catch((err) => {
        return res.send(err);
      });
  });
});

module.exports = router;
