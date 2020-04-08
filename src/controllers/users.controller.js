const usersCtrl = {};

// Models
const User = require("../models/User");

// Modules
const passport = require("passport");

usersCtrl.renderSignUpForm = (req, res) => {
    res.render("users/signup");
};

usersCtrl.signup = async (req, res) => {
    let errors = [];
    const { name, email, password, confirm_password } = req.body;
    if (password != confirm_password) {
        errors.push({ text: "Password do not match."});
    }
    if (password.length < 4) {
        errors.push({text: "Password must be al least 4 characters." });
    }
    if (errors.length > 0 ) {
        res.render("useres/signup", {
            errors,
            name,
            email,
            password,
            confirm_password
        });
    } else {
        // Look for email coincidence
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash("error_msg", "The Email is already in use.");
            res.redirect("/users/signup");
        } else {
            // Saving a New Users
            const newUser = new User( {name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash("success_msg", "You are registered.");
            res.redirect("/users/signin");
        }
    }
};

usersCtrl.renderSignInForm = (req, res) => {
    res.render("users/signin");
};

usersCtrl.signin = passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/signin",
    failureFlash: true
});

usersCtrl.logout = (req, res) => {
    req.logout();
    req.flash("success_msg", "You  ate logged out now.");
    res.redirect("/users/signin");
};

module.exports = usersCtrl;