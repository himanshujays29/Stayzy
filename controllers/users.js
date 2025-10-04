import User from "../models/user.js";

export const renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

export const signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registerdUser = await User.register(newUser, password);
      req.login(registerdUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Stayzy!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };

export const renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

export const login = async (req, res) => {
    req.flash("success", "Welcome Back to Stayzy!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

export const logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye! You are logged out.");
    res.redirect("/listings");
  });
};