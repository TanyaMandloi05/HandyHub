const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const user = require("./models/user");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const localStrategy = require("passport-local");
const productRouter = require("./routes/product");
const reviewRouter = require("./routes/rating");
const userRouter = require("./routes/user");
const flash = require('connect-flash');
const ExpressError = require("./utils/ExpressError");

const port = 8080;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/product");
}

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(flash());

const sessionOpt = {
  secret: "mysecret", //A string used to sign the session ID cookie for security.
  resave: false, //Ensures the session is not saved to the session store on every request if nothing has changed
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 14 * 24 * 60 * 60 * 1000,
    maxAge: 14 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOpt));
app.use(passport.initialize()); //Initializes Passport for authentication.
app.use(passport.session()); // Integrates Passport with Express sessions to store user authentication data in sessions.

passport.use(new localStrategy(user.authenticate()));
// passport.use(new googleStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser()); //Converts the user object into a session-storable format (e.g., user ID).
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.get("/user/dashboard", (req, res) => {
  res.render("user/dashBoard.ejs");
})



app.use("/products", productRouter);
app.use("/products/:id/reviews", reviewRouter);
app.use(userRouter);

// home page
app.get("/home", (req, res) => {
  res.render("product/home");
});

app.listen(port, () => {
  console.log("app is listening to the port 8080");
});

app.all("*", (req, res, next) => {
  next( new ExpressError(404, "Bad request"));
})

app.use((err, req, res, next) => {
  let{statusCode="500", message="something went wrong"} = err;
  res.status(statusCode).send(message);
})
