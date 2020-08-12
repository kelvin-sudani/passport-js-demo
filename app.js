const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const passport = require("./passport/index");
const register = require("./routes/register");
const login = require("./routes/login");
const logout = require("./routes/logout");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

const MONGO_URI =
  "mongodb+srv://cowboy123:cowboy123@todo.ogr6w.mongodb.net/passport_js?retryWrites=true&w=majority";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log(`MongoDB connected`))
  .catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "there is no secret",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

//If user is logged in, passport.js will create user object in req for every request in express.js, ...
//... which you can check for existence in any middleware:
function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send("Please log in first");
  }
}

app.use("/", indexRouter);
app.use("/register", register);
app.use("/login", login);
app.use("/logout", isLoggedIn, logout);
app.use("/users", isLoggedIn, usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
