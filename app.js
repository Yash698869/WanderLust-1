// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");

// Import Express Routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDB connection URL (MongoDB Atlas Cloud Database)
const MONGO_URL = "mongodb+srv://yashchourasia6988_db_user:QeWW0avHWZZ88Cza@cluster0.9koqvs6.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
async function main() {
  await mongoose.connect(MONGO_URL, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(methodOverride("_method")); // Allows PUT & DELETE requests
app.engine("ejs", ejsMate); // ejs-mate for layout support
app.use(express.static(path.join(__dirname, "/public"))); // Serves static files
app.use(cookieParser());

const sessionOptions = {
  secret: "mySuperSecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Home route
app.get("/", (req, res) => {
  res.send("Hi I am root");
});

//for using sessions
app.use(flash());

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//using flash cards
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// //making a fake user
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld"); //(user,password)
//   res.send(registeredUser);
// });

//Cookies
// app.get("/getcookies", (req, res) => {
//   res.cookie("greet", "namaste!"); //key-value pair
//   res.send("send you some cookies");
// });

// Use routers for listings and reviews
app.use("/listings", listingRouter);
app.use("/listings", reviewRouter); // Fix: added missing leading slash
app.use("/", userRouter);

//testing the DB
// app.get("/", (req, res) => {
//   res.send("Working.....");
// });

// app.get("/testingListening", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "calangute , goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("Successfull testing");
// });

// default page if wrong url given
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not Found!"));
// });

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start the server
app.listen(8080, () => {
  console.log("server is listening to port 8080....");
});
