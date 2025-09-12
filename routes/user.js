import express from 'express';
const router = express.Router();
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from 'passport';

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});


router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerdUser = await User.register(newUser, password);
        req.flash("success", "Welcome to Stayzy!");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome Back to Stayzy!");
    res.redirect("/listings");
});


export default router;