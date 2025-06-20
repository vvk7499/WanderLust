const express = require("express");
const router = express.Router();

const listingController = require("../controllers/listing.js");
const { isLoggedIn } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const wrapAsync = require("../utils/wrapAsync.js");

// INDEX (List all listings) & CREATE (Add new listing)
router
  .route("/")
  .get(wrapAsync(listingController.index)) // Async wrapper added
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

// NEW FORM (Render form to create new listing)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW (Details) & UPDATE (Modify) & DELETE (Remove)
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Async wrapper added
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing));

// EDIT FORM (Render form to edit listing)
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListing)); // Async wrapper added

module.exports = router;
