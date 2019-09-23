const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

const initializePassport = require('../passport-config');
initializePassport(
    passport,
    async username => await User.findOne({username: new RegExp("^" + username + "$", "i")}, 'isVerified password').exec(),
    async id => await User.findById(id)
);

router.get('/', checkNotAuthenticated, async (req, res) => {
    req.session.redirectTo = req.header('Referer') || '/';
    let vars = {cPage: "signin", searchOptions: req.query};
    vars.title = "Sign In";
    if(req.isAuthenticated()) {
        const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
        vars.user = user;
    }
    res.render('signin/index', vars);
});

router.post('/', checkNotAuthenticated, passport.authenticate('local', {
    //successRedirect: '../', //redirect to homepage
    failureRedirect: '../signin',
    failureFlash: true //so a message can be displayed to the user */
}), (req, res) => {
    const redirectTo = req.session.redirectTo || '/';
    delete req.session.redirectTo;
    res.redirect(redirectTo);
}); //redirect to previous page


function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect(`/u/${req.user.username}`);
    }
  
    next();
}

router.use('/*', (req, res) => {
    res.redirect('/signin');
})

module.exports = router;