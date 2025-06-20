const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/user.js");
const { saveRedirectUrl } = require("../middleware.js");

// ✅ Signup Routes
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(userController.signup);

// ✅ Login Routes
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// ✅ Logout Route (single method route remains as is)
router.get("/logout", userController.logout);

module.exports = router;
