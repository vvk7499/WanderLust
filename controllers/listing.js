const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");

// ✅ INDEX - With optional country filter
module.exports.index = async (req, res) => {
  const { country, category } = req.query;
  let filter = {};

  if (country) {
    filter.country = new RegExp(country, 'i'); // Case-insensitive country filter
  }

  if (category) {
    filter.category = category; // Exact match for category
  }

  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// CREATE
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// SHOW
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", {
    listing,
    currUser: req.user,
  });
};

// EDIT
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.listing;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!updatedData.image || !updatedData.image.url) {
    updatedData.image = listing.image;
  } else {
    updatedData.image.filename = "listingimage"; // optional
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${updatedListing._id}`);
};

// DELETE
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  await Review.deleteMany({ _id: { $in: listing.reviews } });
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing and its reviews deleted!");
  res.redirect("/listings");
};
