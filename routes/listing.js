//requiring this for express router method
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

//Error handling function schema
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg); //joi is applied here
  } else {
    next();
  }
};

//Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    // res.send("working");
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//New route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing you requested for, does'nt exist's!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Create route
router.post(
  "/",
  validateListing, //passing middleware
  wrapAsync(async (req, res) => {
    // let { title, description, image, price, country, location } = req.body;
    // let listing = req.body.listing; //since we use arr in new this is short to extract values
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

//Edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for, does'nt exist's!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//Update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //req.body.listing-> it is js object where we have all param that we will extract nd send for further parse into updated values
    req.flash("success", "Listing Updated!");
    if (!listing) {
      req.flash("error", "Listing you requested for, does'nt exist's!");
      res.redirect("/listings");
    }
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id); //it will call post middleware in listing and delete related reviews also
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
