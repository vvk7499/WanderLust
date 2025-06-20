const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// ✅ Route for handling reviews on listings
router
  .route("/:id/review")
  .post(isLoggedIn, wrapAsync(reviewController.postReview)); // Create Review

router
  .route("/:id/reviews/:reviewId")
  .delete(isLoggedIn, wrapAsync(reviewController.deleteReview)); // Delete Review

module.exports = router;
