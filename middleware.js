// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.path, "..", req.originalUrl);

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next(); // ✅ Only called if authenticated
};

// Save redirect URL to locals for use after login
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
