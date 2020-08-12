const express = require("express");
const router = express.Router();
//const passport = require("passport");

router.get("/", function (req, res) {
  req.logout();
  res.send("looged out");
});

module.exports = router;
