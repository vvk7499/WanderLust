const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.postReview = (async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Added!");
  res.redirect(`/listings/${id}`);
});

// DELETE: Only the review's author can delete it
module.exports.deleteReview = (async (req, res) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  // Only author can delete
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to delete this review.");
    return res.redirect(`/listings/${id}`);
  }

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
});

