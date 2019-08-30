const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

const initializePassport = require('../passport-config');
initializePassport(
    passport,
    async username => await User.findOne({ username: username}).exec(),
    async id => await User.findById(id)
);

router.get('/', checkNotAuthenticated, (req, res) => {
    let vars = {cPage: "signin", searchOptions: req.query};
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('signin/index', vars);
});

router.post('/', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '../', //or to their account?
    failureRedirect: '../signin',
    failureFlash: true //so a message can be displayed to the user */
}));

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
  
    next();
}

router.use('/*', (req, res) => {
    res.redirect('/signin');
})

module.exports = router;