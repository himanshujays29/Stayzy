export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged In to Create a New Listing");
        return res.redirect("/login");
    }
    next();
};